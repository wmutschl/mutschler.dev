---
title: 'elementary OS 6.1 Jólnir: installation guide with btrfs, luks encryption and auto snapshots with timeshift'
summary: In this guide I will walk you through the installation steps to get an elementary OS 6.1 Jólnir system with a luks-encrypted partition which contains a LVM logical volume for the root filesystem that is formatted with btrfs and contains a subvolume @ for / and a subvolume @home for /home. I will show how to optimize the btrfs mount options and how to setup an encrypted swap partition which works with hibernation. This layout enables one to use timeshift which will regularly take snapshots of the system and (optionally) on any apt operation.
header:
  image: "Elementary_OS_6.1.png"
  caption: "Image credit: [**VARGUX via Wikimedia Commons**](https://commons.wikimedia.org/wiki/File:Elementary_OS_6.1_-_Información_del_Sistema.png)"
tags: ["linux", "elementary-os", "install guide", "btrfs", "luks", "timeshift", "timeshift-autosnap-apt"]
date: 2022-06-15
draft: false
type: book
---

***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev). Pull requests are very much appreciated.***
<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

{{< youtube  >}}
*Video coming soon*

*Note that this written guide is an updated version of the video and contains much more information.*
{{< toc hide_on="xl" >}}
## Overview

In this guide I will show how to install Elementary OS 6.1 Jólnir with the following structure:

* an unencrypted EFI partition
* an unencrypted boot partition (I also show how to optionally encrypt this in the appendix and why I don't)
* an encrypted btrfs partition (with LVM) for the root filesystem
  * the btrfs logical volume contains a subvolume `@` for `/` and a subvolume `@home` for `/home`. Note that Elementary OS's installer does not create btrfs subvolumes by default, so we need to do this manually.
* an encrypted swap partition which works with hibernation
* automatic system snapshots and easy rollback using:
  * [timeshift](https://github.com/teejee2008/timeshift) which will regularly take (almost instant) snapshots of the system
  * [timeshift-autosnap-apt](https://github.com/wmutschl/timeshift-autosnap-apt) which creates btrfs snapshot with timeshift on any system update with apt

This setup works similarly well on other distributions, for which I also have [installation guides (with optional RAID1)](../../install-guides).

## Step 0: General remarks

This tutorial is made with Elementary OS 6.1 Jólnir from [elementary.io](https://elementary.io) copied to an installation media (usually a USB Flash device); checkout [Ventoy](https://www.ventoy.net) for a neat way to organize all kinds of iso files on just one USB Flash device or USB SSD. Other versions of Elementary OS and other distributions that use the same installer (i.e. POP!_OS) might also work, but sometimes require additional steps (see my other [installation guides](../../install-guides)).

**I strongly advise to try the following installation steps in a virtual machine first before doing anything like that on real hardware!** For instance, you can spin up a virtual machine using e.g. the awesome [quickemu](https://github.com/quickemu-project/quickemu) project.

## Step 1: Prepare partitions by performing a Clean Install first
If you already have (a previous version of) Elementary OS installed, you can safely skip this step as you have already a partition layout that will work with the installer.
In my previous installation guides, I manually prepared the partitions to have full control on the individual partition sizes. However, as time moved on I noticed that I tend to stick to the default partition layout that the distros ship out of the box. So the easiest and quickest approach is to simply perform the installation twice. So, let's run the first clean install by selecting `Erase Disk and Install`. I also choose to encrypt my root partition so the installer automatically creates the luks2 partition and sets up LVM. When the installation process finishes, restart your device, but reboot back into the installer to do the second custom install with btrfs.

Now, I do like to take note of the default partition layout. So, if you want to see the structure of the automatic installation keep reading, otherwise go to the next step to perform the second installation.

### [Optional] Understand the default partition layout and installation structure

So, let's open a terminal and have a look on the default partition layout (instead of the terminal commands you can also just use Gparted for this):

```sh
# NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
# loop0    7:0    0   2.2G  1 loop /rofs
# sda      8:0    0  55.9G  0 disk 
# ├─sda1   8:1    0   498M  0 part 
# ├─sda2   8:2    0     4G  0 part 
# ├─sda3   8:3    0  47.4G  0 part 
# └─sda4   8:4    0     4G  0 part [SWAP]
# sdb      8:16   0 465.8G  0 disk 
# ├─sdb1   8:17   0 263.1M  0 part 
# ├─sdb2   8:18   0 976.6M  0 part 
# └─sdb3   8:19   0 464.6G  0 part 
# sdc      8:32   0 223.6G  0 disk 
# ├─sdc1   8:33   0   100M  0 part 
# ├─sdc2   8:34   0    16M  0 part 
# ├─sdc3   8:35   0   223G  0 part 
# └─sdc4   8:36   0   517M  0 part 
# sdd      8:48   1  58.9G  0 disk 
# ├─sdd1   8:49   1  58.8G  0 part 
# └─sdd2   8:50   1    32M  0 part 
```
I've installed Elementary OS to a SSD which is recognized as `sdb` on my machine. `sda` is another SSD and Windows is installed on `sdc`. Lastly, `sdd` is the USB stick on which I have [Ventoy](https://www.ventoy.net) installed and which contains the ISO of the installer.

So let's have a closer look at the partition layout of `sdb`:

```sh
sudo parted /dev/sdb unit MiB print
# Model: ATA Samsung SSD 840 (scsi)
# Disk /dev/sdb: 476940MiB
# Sector size (logical/physical): 512B/512B
# Partition Table: gpt
# Disk Flags: 
# 
# Number  Start    End        Size       File system  Name  Flags
#  1      2.00MiB  265MiB     263MiB     fat32              boot, esp
#  2      265MiB   1242MiB    977MiB     ext4
#  3      1242MiB  476938MiB  475696MiB
```

We have the following 4 partitions:

1. a 263 MiB FAT32 EFI partition (note the `boot, esp` flag)
2. a 977 MiB ext4 boot partition
3. a 475696MiB partition that contains the actual system files

Let's have a closer look at the luks2-encrypted `sdb3` partition:

```sh
sudo cryptsetup luksDump /dev/sdb3
# LUKS header information
# Version:       	2
# Epoch:         	3
# Metadata area: 	16384 [bytes]
# Keyslots area: 	16744448 [bytes]
# UUID:          	aa371a41-81f4-4f12-800e-8830a9afa8c8
# Label:         	(no label)
# Subsystem:     	(no subsystem)
# Flags:       	(no flags)
# 
# Data segments:
#   0: crypt
# 	offset: 16777216 [bytes]
# 	length: (whole device)
# 	cipher: aes-xts-plain64
# 	sector: 512 [bytes]
# 
# Keyslots:
#   0: luks2
# 	Key:        512 bits
# 	Priority:   normal
# 	Cipher:     aes-xts-plain64
# 	Cipher key: 512 bits
# 	PBKDF:      argon2i
# 	Time cost:  4
# 	Memory:     1048576
# 	Threads:    4
```

So this basically uses the default options to encrypt a partition with luks version 2 (e.g. running `cryptsetup luksFormat /dev/sdb3`). Now let's have a closer look what is inside the encrypted partition:

```sh
sudo cryptsetup luksOpen /dev/sdb3 cryptdata
# Enter passphrase for /dev/sda3:
ls /dev/mapper
# control  cryptdata  data-root data-swap
sudo pvs
#   PV                    VG   Fmt  Attr PSize    PFree
#   /dev/mapper/cryptdata data lvm2 a--  <464.53g    0 
sudo vgs
#   VG   #PV #LV #SN Attr   VSize    VFree
#   data   1   2   0 wz--n- <464.53g    0 
sudo lvs
#   LV   VG   Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
#   root data -wi-a----- 460.73g                                                    
#   swap data -wi-a-----  <3.80g
sudo lsblk /dev/mapper/data-root -f
# NAME      FSTYPE LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINT
# data-root ext4         90d9bc34-e97c-45aa-939f-e1a0d3736eed 
```

By default, if you do an encrypted install, Elementary OS uses [Logical Volume Management (LVM)](https://askubuntu.com/questions/3596/what-is-lvm-and-what-is-it-used-for), which is a fancy way to combine different disks dynamically into the same partition. In more detail, the encrypted partition (called `cryptdata`) is a physical volume that contains a volume group called `data`. Inside the volume group there are two logical volumes, one is called `root` that contains our actual system files and another one is called `swap` that is used as a swap partition. The `data-root` partition is formatted with ext4. I actually never use any features of LVM, but there is no downside in terms of performance or similar things when using it. More important, the installer requires LVM if you plan to use encryption. Without encryption you don't need the whole LVM stuff.

Okay, now we know what the partition layout is, so let's close everything:
```sh
sudo cryptsetup luksClose /dev/mapper/data-root
sudo cryptsetup luksClose /dev/mapper/data-swap
sudo cryptsetup luksClose /dev/mapper/cryptdata
ls /dev/mapper
# control
```

Now let's continue with the ACTUAL INSTALL with btrfs as the underlying filesystem.

## Step 2: Install Elementary OS using the `Custom Install (Advanced)` option

Now, if you have not done so already, let's reboot into the installer. Select the language and keyboard layout. Then choose `Custom Install (Advanced)`. You will see your partitioned hard disk (in my case it is `/dev/sdb`, be careful!):

* Click on the first partition, activate `Use partition`, activate `Format`, Use as `Boot (/boot/efi)`, Filesystem: `fat32`.
* Click on the second partition, activate `Use partition`, activate `Format`, Use as `Custom` and enter `/boot`, Filesystem: `ext4`.
* Click on the third and largest partition. A `Decrypt This Partition` dialog opens, enter your luks password and hit `Decrypt`. For me, I was not able to change the name from `data` to something else (e.g. `cryptdata`), as it then did not show the decrypted device, so I left it at `data`.
* A new device `LVM data` will be displayed (often at the bottom of the screen)
  * Click on the first partition of `LVM data`, activate `Use partition`, activate `Format`, Use as `Root (/)` , Filesystem: `btrfs`.
  * Click on the second partition of `LVM data`, activate `Use partition`, Use as `Swap`.

*If you have other partitions, check their types and use; particularly, deactivate using or changing any other EFI partitions.*

Recheck everything (check the partitions where there is a black checkmark) and hit `Erase and Install`.

Once the installer finishes, restart, but reboot yet again into the live installer. Now select `Try Demo Mode` to do the post-installation steps.

## Step 3: Post-Installation steps

Open a terminal and switch to an interactive root session:

```sh
sudo -i
```
You might find maximizing the terminal window is helpful for working with the command-line.

### Mount the btrfs top-level root filesystem with zstd compression

Let's mount our root partition (the top-level btrfs volume always has root-id 5), but with some mount options that optimize performance and durability on SSD or NVME drives:

```sh
cryptsetup luksOpen /dev/sdb3 data
# Enter passphrase for /dev/sdb3

ls /dev/mapper
# control  data  data-root  data-swap

mount -o subvolid=5,defaults,compress=zstd:1,space_cache=v2,discard=async /dev/mapper/data-root /mnt
```

By default, Elementary OS uses the default mount options of btrfs. That is, SSD drives will be automatically detected (`ssd` mount option). I have found that there is some additional general advise to use:

* `compress=zstd:1`: allows to specify the compression algorithm which we want to use. btrfs provides lzo, zstd and zlib compression algorithms; however, zstd has become the best performing candidate. I use level 1 as this is recommended by the [Fedora team on a workstation](https://fedoraproject.org/wiki/Changes/BtrfsTransparentCompression#Simple_Analysis_of_btrfs_zstd_compression_level)
* `space_cache=v2`, which is also the [default in Fedora](https://pagure.io/fedora-btrfs/project/issue/24)
* `discard=async`: this will become the standard soon, see e.g. [enable discard=async by default](https://pagure.io/fedora-btrfs/project/issue/6)

Now there is some debate whether one should use [`noatime` (instead of the default `relatime`)](https://pagure.io/fedora-btrfs/project/issue/9), but personally I have not seen any difference, so I'm not using `noatime` in this guide. 

We will later also append these mount options to the fstab, but it is good practice to already make use of compression when moving the system files from the top-level btrfs root into the dedicated subvolumes `@` and `@home`.

### Create btrfs subvolumes `@` and `@home`

Now we will first create the subvolume `@` and move all files and folders from the top-level filesystem into `@`. Note that as we use the optimized mount options like compression, these will be already applied during the moving process:

```sh
btrfs subvolume create /mnt/@
# Create subvolume '/mnt/@'
cd /mnt
ls | grep -v @ | xargs mv -t @
# this moves all files that don't have "@" in the name to the @/ folder
ls -a /mnt
# . .. @
ls -a /mnt/@
# .   bin   dev  home  lib32  libx32  mnt  proc  run   srv  tmp  var
# ..  boot  etc  lib   lib64  media   opt  root  sbin  sys  usr  vmlinuz
```

Now let's create another subvolume called `@home`:
```sh
btrfs subvolume create /mnt/@home
# Create subvolume '/mnt/@home'
```
If you did a clean install, there is no user folder yet. However, if you adapted the guide for a manual install and have already created a user, then make sure that any user folder from `/mnt/@/home/` goes into `@home`:
```sh
mv /mnt/@/home/* /mnt/@home/
# mv: cannot stat '/mnt/@/home/*': No such file or directory
```
Let's see the subvolumes:
```sh
btrfs subvolume list /mnt
# ID 265 gen 592 top level 5 path @
# ID 266 gen 592 top level 5 path @home
```

### Changes to fstab

We need to make some changes to the `fstab` in order to:

* mount the `@` subvolume to `/`
* mount the `@home` subvolume to `/home`
* rename device of swap partition (for some reason the installer does not use the correct device name)
* make use of optimized btrfs mount options

So open it with a text editor, e.g.:

```sh
nano /mnt/@/etc/fstab
```

or use these `sed` commands

```sh
sed -i 's/btrfs  defaults/btrfs  defaults,subvol=@,compress=zstd:1,space_cache=v2,discard=async/' /mnt/@/etc/fstab
echo "UUID=$(blkid -s UUID -o value /dev/mapper/data-root)  /home  btrfs  defaults,subvol=@home,compress=zstd:1,space_cache=v2,discard=async   0 0" >> /mnt/@/etc/fstab
sed -i 's|/dev/dm-3|/dev/mapper/data-swap|' /mnt/@/etc/fstab
```

Either way your `fstab` should look like this:

```sh
cat /mnt/@/etc/fstab
# PARTUUID=1c290d06-e8c2-40f6-9ad8-034069dd071b  /boot/efi  vfat  umask=0077  0  0
# UUID=8f652774-cb1e-474d-a114-d8a9c9ccd54d  /boot  ext4  noatime,errors=remount-ro  0  0
# UUID=8b47e39b-e599-4268-92c3-586c8a4435e4  /  btrfs  defaults,subvol=@,compress=zstd:1,space_cache=v2,discard=async  0  0
# /dev/mapper/data-swap  none  swap  defaults  0  0
# UUID=8b47e39b-e599-4268-92c3-586c8a4435e4  /home  btrfs  defaults,subvol=@home,compress=zstd:1,space_cache=v2,discard=async   0 0
```

Note that your PARTUUID and UUID numbers will be different.

### Changes to crypttab

As we use `discard=async`, we need to add `discard` to the `crypttab`:

```sh
sed -i 's/luks/luks,discard/' /mnt/@/etc/crypttab
cat /mnt/@/etc/crypttab
# data UUID=aa371a41-81f4-4f12-800e-8830a9afa8c8 none luks,discard
```

### Adjust configuration of grub

We need to add a kernel parameter to the grub configuration that the system boots from the `@` subvolume:

```sh
nano /mnt/@/etc/default/grub
```

Here you need to add `rootflags=subvol=@` to the `GRUB_CMDLINE_LINUX_DEFAULT` options. That is, the uncommented lines of your configuration file should look like this:

```sh
GRUB_DEFAULT=0
GRUB_TIMEOUT_STYLE=hidden
GRUB_TIMEOUT=0
GRUB_DISTRIBUTOR=`lsb_release -d -s 2> /dev/null || echo Debian`
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash rootflags=subvol=@"
GRUB_CMDLINE_LINUX=""

GRUB_ENABLE_CRYPTODISK=y
```

### Create a chroot environment to update initramfs and grub

Now, let's create a chroot environment, which enables one to work directly inside the newly installed OS, without actually booting into it. For this, unmount the top-level root filesystem from `/mnt` and remount the subvolume `@` to `/mnt`:

```sh
cd /
umount -l /mnt
mount -o subvol=@,defaults,compress=zstd:1,space_cache=v2,discard=async /dev/mapper/data-root /mnt
ls /mnt
# bin   dev  home  lib32  libx32  mnt  proc  run   srv  tmp  var
# boot  etc  lib   lib64  media   opt  root  sbin  sys  usr  vmlinuz
```

Then the following commands will put us into our system using chroot (taken from System76's help post on how to [Repair the Bootloader](https://support.system76.com/articles/bootloader/#systemd-boot)):

```sh
for i in /dev /dev/pts /proc /sys /run; do mount -B $i /mnt$i; done
chroot /mnt
```

We are now inside the new system, so let's check whether our `fstab` mounts everything correctly. We have to run the command twice or otherwise the efi partition does not mount correctly:

```sh
mount -av
# /boot                    : successfully mounted
# /                        : ignored
# none                     : ignored
# /home                    : successfully mounted
mount -av
# /boot/efi                : successfully mounted
# /boot                    : already mounted
# /                        : ignored
# none                     : ignored
# /home                    : already mounted
```
Note that I had to run the command twice to make sure that the EFI partition is mounted.

Now we need to update both the initramfs and grub to make it aware of our kernel parameter changes (I'm not sure whether initramfs is really necessary, but better safe than sorry, let me know if you know better):

```sh
update-initramfs -c -k all
# update-initramfs: Generating /boot/initrd.img-5.11.0-43-generic

update-grub
# Sourcing file `/etc/default/grub'
# Sourcing file `/etc/default/grub.d/init-select.cfg'
# Generating grub configuration file ...
# Found linux image: /boot/vmlinuz-5.11.0-43-generic
# Found initrd image: /boot/initrd.img-5.11.0-43-generic
# Found Windows Boot Manager on /dev/sdc1@/efi/Microsoft/Boot/bootmgfw.efi
# Adding boot menu entry for UEFI Firmware Settings
# done
```


## Step 4: Reboot, some checks, and system updates

Now, it is time to exit the chroot.

```sh
exit
reboot now
```

Cross your fingers! If all went well you should see a passphrase prompt to unlock your LUKS partition (YAY!), where you enter the luks passphrase and your system should boot. (For some reason on my machine there was no passphrase after 10 seconds, so I rebooted and then it came.)
Select the language, keyboard layout and create a user account. Go through the Welcome Screen.

Now let's see whether everything is set up correctly. So open a terminal:

```sh
sudo mount -av
# /boot/efi                : already mounted
# /boot                    : already mounted
# /                        : ignored
# none                     : ignored
# /home                    : already mounted
```

All the entries in the `fstab` are mounted correctly.

```sh
sudo mount -v | grep /dev/mapper
# /dev/mapper/data-root on / type btrfs (rw,relatime,compress=zstd:1,ssd,discard=async,space_cache=v2,subvolid=265,subvol=/@)
# /dev/mapper/data-root on /home type btrfs (rw,relatime,compress=zstd:1,ssd,discard=async,space_cache=v2,subvolid=266,subvol=/@home)

```

Our optimized btrfs mount options were passed on and are used correctly. Note that you cannot have different mount options on the same partition.

```sh
sudo swapon
# NAME      TYPE      SIZE USED PRIO
# /dev/dm-2 partition 3.8G   0B   -2
```

The encrypted swap partition is in use.

```sh
sudo btrfs filesystem show /
# Label: none  uuid: 8b47e39b-e599-4268-92c3-586c8a4435e4
# 	Total devices 1 FS bytes used 7.27GiB
# 	devid    1 size 460.73GiB used 9.02GiB path /dev/mapper/data-root

sudo btrfs subvolume list /
# ID 265 gen 655 top level 5 path @
# ID 266 gen 655 top level 5 path @home
```
These two btrfs commands tell us which disk is in use and which subvolumes are available.

If you have installed elementary OS on a SSD or NVME, enable `fstrim.timer` as [both fstrim and discard=async mount option can peacefully co-exist](https://www.phoronix.com/scan.php?page=news_item&px=Fedora-Btrfs-Opts-Discard-Comp):

```sh
sudo systemctl enable fstrim.timer
```

Importantly, for [SSD trimming to work properly](https://www.heise.de/ct/hotline/Linux-Verschluesselte-SSD-trimmen-2405875.html), it is important that you add `discard` to your `crypttab` (see above). Also check whether you `issue_discards=1` is set in `/etc/lvm/lvm.conf` (it should be set to 1 by default):

```sh
cat /etc/lvm/lvm.conf | grep issue_discards
# 	# Configuration option devices/issue_discards.
# 	issue_discards = 1
```

If all look's good, let's update and upgrade the system:

```sh
sudo apt update
sudo apt upgrade
sudo apt dist-upgrade
sudo apt autoremove
sudo apt autoclean
flatpak update
```

Also I go into AppCenter to see whether there are some drivers that I can additionally install (in my case for my WiFi adapter I need to install `bcmwl-kernel-source`). 

Finally, do another reboot.

## Step 5: Install timeshift and timeshift-autosnap-apt

Install timeshift and configure it directly via the GUI:

```sh
sudo apt install -y timeshift
sudo timeshift-gtk
```

* Select "btrfs" as the "Snapshot Type"; continue with "Next"
* Choose your btrfs system partition as "Snapshot Location"; continue with "Next". On encrypted systems Timeshift sometimes complains that the partition is not formated with btrfs, just ignore this bug and click next.
* "Select Snapshot Levels" (type and number of snapshots that will be automatically created and managed/deleted by timeshift), my recommendations:
  * Activate "Monthly" and set it to 2
  * Activate "Weekly" and set it to 3
  * Activate "Daily" and set it to 5
  * Deactivate "Hourly"
  * Activate "Boot" and set it to 5
  * Activate "Stop cron emails for scheduled tasks"
  * continue with "Next"
  * I do opt to include the `@home` subvolume (which is not selected by default). Note that when you restore a snapshot with timeshift you get to choose whether you want to restore @home as well (which in most cases you actually don't want to do!). But having snapshots of my home folder is quite convenient to access older files I accidently deleted.
  * Activate "Enable BTRFS qgroups (recommended)". There are some [issues on GitHub](https://github.com/teejee2008/timeshift/issues?q=is%3Aissue+quota+qgroup+) that there MIGHT be some performance issues with this (if you manually deactivate quotas as well), but I've never had any issues, so I stick with the recommendation to enable it.
  * Click "Finish"
* "Create" a manual first snapshot, add a comment "Clean Install" to it & exit timeshift

In the terminal you will see an `ERROR: can't list qgroups: quotas not enabled`. Simply ignore this as this error comes only the first time you run timeshift, e.g. run `sudo timeshift --create` in the terminal to create another snapshot and you won't see this error anymore.

Now, *timeshift* will check every hour if snapshots ("hourly", "daily", "weekly", "monthly", "boot") need to be created or deleted. Note that "boot" snapshots will not be created directly but about 10 minutes after a system startup using a cronjob defined in `/etc/cron.d/timeshift-hourly` and `/etc/cron.d/timeshift-boot`.

All snapshots are accessible from `/run/timeshift/backup` (this folder will be mounted after timeshift runs for the first time after a system reboot). Conveniently, the top-level root (subvolid 5) of your btrfs partition is also mounted there, so it is easy to view, create, delete and move around snapshots manually if needed.

```sh
ls /run/timeshift/backup
# @  @home  timeshift-btrfs
```

Note that `/run/timeshift/backup/@` is your `/` folder and `/run/timeshift/backup/@home` your `/home` folder. Your snapshots are accessible via timeshift-btrfs.

Now, to also automatically create timeshift snapshots when updating our system (or any other apt installation like installing or removing apps), let's install *timeshift-autosnap-apt* from my GitHub repo (which is just an APT hook):

```sh
sudo apt install -y git make
git clone https://github.com/wmutschl/timeshift-autosnap-apt.git /home/$USER/timeshift-autosnap-apt
cd /home/$USER/timeshift-autosnap-apt
sudo make install
```

After this, make changes to the configuration file:

```sh
sudo nano /etc/timeshift-autosnap-apt.conf
```

For example, as we have a dedicated `/boot` partition, we should keep `snapshotBoot=true` in the `timeshift-autosnap-apt-conf` file such that the `/boot` directory is rsync'ed to `/boot.backup`. Note that the EFI partition will be rsynced into `/boot.backup/efi`. So if something goes wrong with either the boot or the EFI partition, you always have a backup of it as well inside your snapshots. You can also install `grub-btrfs` to be able to boot into the snapshots from GRUB, but I don't really need or do this.

Check if everything is working:

```
sudo timeshift-autosnap-apt
# Rsyncing /boot into the filesystem before the call to timeshift.
# Rsyncing /boot/efi into the filesystem before the call to timeshift.
# Using system disk as snapshot device for creating snapshots in BTRFS mode
# 
# /dev/dm-1 is mounted at: /run/timeshift/backup, options: rw,relatime,compress=zstd:1,ssd,discard=async,space_cache=v2,subvolid=5,subvol=/
# 
# Creating new backup...(BTRFS)
# Saving to device: /dev/dm-1, mounted at path: /run/timeshift/backup
# Created directory: /run/timeshift/backup/timeshift-btrfs/snapshots/2022-06-16_21-33-16
# Created subvolume snapshot: /run/timeshift/backup/timeshift-btrfs/snapshots/2022-06-16_21-33-16/@
# Created subvolume snapshot: /run/timeshift/backup/timeshift-btrfs/snapshots/2022-06-16_21-33-16/@home
# Created control file: /run/timeshift/backup/timeshift-btrfs/snapshots/2022-06-16_21-33-16/info.json
# BTRFS Snapshot saved successfully (0s)
# Tagged snapshot '2022-06-16_21-33-16': ondemand
------------------------------------------------------------------------------

```

Now, if you run `sudo apt install|remove|upgrade|dist-upgrade`, *timeshift-autosnap-apt* will create a snapshot of your system with *timeshift*.

## Step 6: Practice recovery and system rollback
Now let's practice what to do in the event of a system disaster. Note that we just created snapshots to which we can always rollback. So as a practice case, let's delete our `/etc` folder, which of course you should never do:

```sh
sudo rm -rf /etc
```
Now try to reboot and you will notice that the boot process obviously gets stuck because the system is broken. So instead boot into any live linux system or the elementary OS installer. Then go to the File Manager and to Other locations. Select your encrypted disk and enter your luks passphrase to decrypt it. Note that this mounts the top-level root of your system, so you can either now directly access the broken files and move them back or simply use timeshift to rollback.

### Rollback with timeshift
Install timeshift either from the Software center or using the terminal (on Ubuntu-based live systems):

```sh
sudo apt install timeshift
```
Open Timeshift, select BTRFS and your disk and you will see the snapshots we created. Select one and hit `Restore`. Timeshift will then rename and move your current broken `@` subfolder away and replace it with the snapshot that you just selected. Reboot and all is back to normal! Easy huh?!

## Appendix: encrypt /boot partition
wip

**FINISHED! CONGRATULATIONS AND THANKS FOR STICKING THROUGH!**

**Check out my [elementary OS post-installation steps](../elementary-os-post-install).**
