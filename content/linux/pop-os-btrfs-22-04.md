---
title: 'Pop!_OS 22.04: installation guide with btrfs, luks encryption and auto snapshots with timeshift'
summary: In this guide I will walk you through the installation procedure to get a Pop!_OS 22.04 system with a luks-encrypted partition which contains a LVM with a logical volume for the root filesystem that is formatted with btrfs and contains a subvolume @ for / and a subvolume @home for /home. I will show how to optimize the btrfs mount options and how to setup an encrypted swap partition which works with hibernation. This layout enables one to use timeshift which will regularly take snapshots of the system and (optionally) on any apt operation. The recovery system of Pop!_OS is also installed to the disk and accessible via the systemd bootloader.
header:
  image: "Linux_Pop_OS!_penguin_Tux.png"
  caption: "Image credit: [**Linux_Pop_OS!_penguin_Tux by Jayaguru-Shishya**](https://commons.wikimedia.org/wiki/File:Linux_Pop_OS!_penguin_Tux.png)"
tags: ["linux", "pop-os", "install guide", "btrfs", "luks", "timeshift", "timeshift-autosnap-apt"]
date: 2022-05-24
---
***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev). Pull requests are very much appreciated.***
<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

```md
{{< youtube i8HDHAX1RJc >}}
```
*Note that this written guide is an updated version of the video and contains much more information.*

## Overview

I am exclusively using btrfs as my filesystem on all my Linux systems, see [Why I (still) like btrfs](../btrfs/). So, in this guide I will show how to install Pop!_OS 22.04 with the following structure:

* an unencrypted EFI partition for the systemd bootloader
* an unencrypted partition for the Pop!_OS recovery system
* an encrypted swap partition which works with hibernation
* an encrypted btrfs partition (with LVM) for the root filesystem
  * the btrfs logical volume contains a subvolume `@` for `/` and a subvolume `@home` for `/home`. Note that the Pop!_OS installer does not create btrfs subvolumes by default, so we need to do this manually.
* automatic system snapshots and easy rollback using:
  * [timeshift](https://github.com/teejee2008/timeshift) which will regularly take (almost instant) snapshots of the system
  * [timeshift-autosnap-apt](https://github.com/wmutschl/timeshift-autosnap-apt) which creates btrfs snapshot with timeshift on any system update with apt

This setup works similarly well on other distributions, for which I also have [installation guides (with optional RAID1)](../../install-guides).

## Step 0: General remarks

This tutorial is made with Pop!_OS 22.04 from [System76](https://system76.com/pop) copied to an installation media (usually a USB Flash device). Other versions of Pop!_OS and other distributions that use the systemd boot manager might also work, but sometimes require additional steps (see my other [installation guides](../../install-guides)).

**I strongly advise to try the following installation steps in a virtual machine first before doing anything like that on real hardware!** For instance, you can spin up a virtual machine using e.g. the awesome [quickemu](https://github.com/quickemu-project/quickemu) project.

## Step 1: Prepare partitions by performing a Clean Install first
If you already have (a previous version of) POP!_OS installed, you can safely skip this step as you have already a partition layout that will work with the installer.
In my previous installation guides, I manually prepared the partitions to have full control on the individual partition sizes. However, as time moved on I noticed that I tend to stick to the default partition layout of POP!_OS. So the easiest and quickest approach is to simply perform the installation twice. So, let's run first the automatic `Clean Install` with encryption. When this finishes, do NOT `Restart Device` or `Shut Down`, but instead right-click in the dock on the `Install Pop!_OS` app and select `Quit`.

Of course, you can adapt the partitions with Gparted to your licking. If you want to see the structure of the installation keep reading, otherwise go to the next step to perform the second Installation.

### [Optional] Understand the default partition layout and installation structure

So, let's open a terminal and have a look on the default partition layout (obviously you should probably just use Gparted for this):

```sh
sudo lsblk
# NAME       MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
# loop0        7:0    0   2.4G  1 loop /rofs
# sda          8:0    0  55.9G  0 disk 
# ├─sda1       8:1    0   498M  0 part 
# ├─sda2       8:2    0     4G  0 part 
# ├─sda3       8:3    0  47.4G  0 part 
# └─sda4       8:4    0     4G  0 part 
# sdb          8:16   0 465.8G  0 disk 
# sdc          8:32   0 223.6G  0 disk 
# ├─sdc1       8:33   0   100M  0 part 
# ├─sdc2       8:34   0    16M  0 part 
# ├─sdc3       8:35   0   223G  0 part 
# └─sdc4       8:36   0   517M  0 part 
# sdd          8:48   1  58.9G  0 disk 
# ├─sdd1       8:49   1  58.8G  0 part 
# │ └─ventoy 253:0    0   2.5G  1 dm   /media/pop-os/Pop_OS 22.04 amd64 # Intel
# │                                    /cdrom
# └─sdd2       8:50   1    32M  0 part /media/pop-os/Pop_OS 22.04 amd64 Intel
```
I've installed POP!_OS to a small SSD which is recognized as `sda` on my machine. `sdb` is another empty ssd and Windows is installed on `sdc`. Lastly, `sdd` is a USB stick on which I have [Ventoy](https://www.ventoy.net) installed and which contains the ISO of the installer.

So let's have a closer look at the partition layout of `sda`:

```sh
sudo parted /dev/sda unit MiB print
# Model: ATA Patriot Pyro SE (scsi)
# Disk /dev/sda: 57242MiB
# Sector size (logical/physical): 512B/512B
# Partition Table: gpt
# Disk Flags: 
# Number  Start     End       Size      File system     Name      Flags
#  1      2.00MiB   500MiB    498MiB    fat32                     boot, esp
#  2      500MiB    4596MiB   4096MiB   fat32           recovery  msftdata
#  3      4596MiB   53144MiB  48548MiB
#  4      53144MiB  57240MiB  4096MiB   linux-swap(v1)            swap
```

We have the following 4 partitions:

1. a 498 MiB FAT32 EFI partition for the systemd bootloader (note the boot, eps flags)
2. a 4096 MiB FAT32 partition for the Pop!_OS recovery system
3. a 48548MiB partition that contains the actual system files
4. a 4096 MiB swap partition for (encrypted) swap use

Let's have a closer look at the luks2-encrypted `sda3` partition:

```sh
sudo cryptsetup luksDump /dev/sda3
# LUKS header information
# Version:       	2
# Epoch:         	3
# Metadata area: 	16384 [bytes]
# Keyslots area: 	16744448 [bytes]
# UUID:          	52d31097-e125-46f0-a139-85087e1b5565
# Label:         	(no label)
# Subsystem:     	(no subsystem)
# Flags:       	(no flags)

# Data segments:
#   0: crypt
# 	offset: 16777216 [bytes]
# 	length: (whole device)
# 	cipher: aes-xts-plain64
# 	sector: 512 [bytes]

# Keyslots:
#   0: luks2
# 	Key:        512 bits
# 	Priority:   normal
# 	Cipher:     aes-xts-plain64
# 	Cipher key: 512 bits
# 	PBKDF:      argon2id
# 	Time cost:  4
# 	Memory:     1048576
# 	Threads:    4
```

So this basically uses the default options to encrypt a partition with luks (e.g. running `cryptsetup luksFormat /dev/sda3`). Now let's have a closer look what is inside the encrypted partition:

```sh
sudo cryptsetup luksOpen /dev/sda3 cryptdata
# Enter passphrase for /dev/sda3:
ls /dev/mapper
# control  cryptdata  data-root
sudo pvs
#  PV                    VG   Fmt  Attr PSize  PFree
#  /dev/mapper/cryptdata data lvm2 a--  47.39g    0
sudo vgs
#  VG   #PV #LV #SN Attr   VSize  VFree
#  data   1   1   0 wz--n- 47.39g    0
sudo lvs
#  LV   VG   Attr       LSize  Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
#  root data -wi-a----- 47.39g
sudo lsblk /dev/mapper/data-root -f
#NAME      FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
#data-root ext4   1.0         bcb96b85-03df-45ca-92aa-6a182386631b 
```

By default, if you install with encryption POP!_OS uses [Logical Volume Management (LVM)](https://askubuntu.com/questions/3596/what-is-lvm-and-what-is-it-used-for), which is a fancy way to combine different disks dynamically into the same partition. In more detail, the encrypted partition (called `cryptdata`) is a physical volume that contains a volume group called `data`. Inside the volume group there is a logical volume called `root` that contains our actual system files. This `data-root` partition is formatted with ext4. I actually never use any features of LVM, but there is no downside in terms of performance or similar to using it. Moreover, the installer requires LVM if you plan to use encryption. 

Okay, now we know what the partition layout is, so let's close everything:
```sh
sudo cryptsetup luksClose /dev/mapper/data-root
sudo cryptsetup luksClose /dev/mapper/cryptdata
ls /dev/mapper
# control
```
and do the actual second install with btrfs as the underlying filesystem.

## Step 2: Install Pop!_OS using the `Custom (Advanced)` option

Now let's open again the installer from the dock, select the region, language and keyboard layout. Then choose `Custom (Advanced)`. You will see your partitioned hard disk:

* Click on the first partition, activate `Use partition`, activate `Format`, Use as `Boot /boot/efi`, Filesystem: `fat32`.
* Click on the second partition, activate `Use partition`, activate `Format`, Use as `Custom` and enter `/recovery`, Filesystem: `fat32`.
* Click on the third and largest partition. A `Decrypt This Partition` dialog opens, enter your luks password and hit `Decrypt`. A new device is `LVM data` will be displayed (often at the bottom of the screen). Click on this partition, activate `Use partition`, activate `Format`, Use as `Root (/)` , Filesystem: `btrfs`.
* Click on the fourth partition, activate `Use partition`, Use as `Swap`.

*If you have other partitions, check their types and use; particularly, deactivate using or changing any other EFI partitions.*

Recheck everything (check the partitions where there is a black checkmark) and hit `Erase and Install`. Follow the steps to create a user account and to write the changes to the disk. Once the installer finishes do NOT select **Restart Device**, but keep the window open.

## Step 3: Post-Installation steps

Open a terminal and switch to an interactive root session:

```sh
sudo -i
```
You might find maximizing the terminal window is helpful for working with the command-line.

### Mount the btrfs top-level root filesystem with zstd compression

Let's mount our root partition (the top-level btrfs volume always has root-id 5), but with some mount options that optimize performance and durability on SSD or NVME drives:

```sh
cryptsetup luksOpen /dev/sda3 cryptdata
# Enter passphrase for /dev/sda3
mount -o subvolid=5,defaults,compress=zstd:1,discard=async /dev/mapper/data-root /mnt
```
By default, POP!_OS 22.04. uses the default mount options of btrfs. That is, SSD drives will be automatically detected (`ssd` mount option) and `space_cache=v2`, which is also the [default in Fedora](https://pagure.io/fedora-btrfs/project/issue/24). Now there is some debate whether one should use [`noatime` (instead of the default `relatime`)](https://pagure.io/fedora-btrfs/project/issue/9), but personally I have not seen any difference, so I'm not using `noatime` in this guide. However, I have found that there is some additional general advise to use:

* `compress=zstd:1`: allows to specify the compression algorithm which we want to use. btrfs provides lzo, zstd and zlib compression algorithms; however, zstd has become the best performing candidate. I use level 1 as this is recommended by the [Fedora team on a workstation](https://fedoraproject.org/wiki/Changes/BtrfsTransparentCompression#Simple_Analysis_of_btrfs_zstd_compression_level)
* `discard=async`: this will become the standard soon, see e.g. [enable discard=async by default](https://pagure.io/fedora-btrfs/project/issue/6)

We will later also append these mount options to the fstab, but it is good practice to already make use of compression when moving the system files from the top-level btrfs root into the dedicated subvolumes `@` and `@home`.

### Create btrfs subvolumes `@` and `@home`

Now we will first create the subvolume `@` and move all files and folders from the top-level filesystem into `@`. Note that as we use the optimized mount options like compression, these will be already applied during the moving process:

```sh
btrfs subvolume create /mnt/@
# Create subvolume '/mnt/@'
mv /mnt/* /mnt/@/
# mv: cannot move '/mnt/@' to a subdirectory of itself, '/mnt/@/@' (ignore this)
ls -a /mnt
# . .. @
```

Now let's create another subvolume called `@home` and move the user folder from `/mnt/@/home/` into `@home`:

```sh
btrfs subvolume create /mnt/@home
# Create subvolume '/mnt/@home'
mv /mnt/@/home/* /mnt/@home/
ls -a /mnt/@/home
# . ..
ls -a /mnt/@home
# . .. wmutschl

btrfs subvolume list /mnt
# ID 264 gen 339 top level 5 path @
# ID 265 gen 340 top level 5 path @home
```

### Changes to fstab

We need to adapt the `fstab` to

* mount `/` to the `@` subvolume
* mount `/home` to the `@home` subvolume
* make use of optimized btrfs mount options

So open it with a text editor, e.g.:

```sh
nano /mnt/@/etc/fstab
```

or use these `sed` commands

```sh
sed -i 's/btrfs  defaults/btrfs  defaults,subvol=@,compress=zstd:1,discard=async/' /mnt/@/etc/fstab
echo "UUID=$(blkid -s UUID -o value /dev/mapper/data-root)  /home  btrfs  defaults,subvol=@home,compress=zstd:1,discard=async   0 0" >> /mnt/@/etc/fstab
```

Either way your `fstab` should look like this:

```sh
cat /mnt/@/etc/fstab
# PARTUUID=2ea6ae0f-6b6a-4e4c-8eaa-7fec8dde5162  /boot/efi  vfat   umask=0077  0  0
# PARTUUID=8ce17e3b-3853-4d10-b878-5dd1ccd6fe8a  /recovery  vfat   umask=0077  0  0
# /dev/mapper/cryptswap                          none       swap   defaults    0  0
# UUID=052ec665-cf5d-4372-bb65-1b82237b9101      /          btrfs  defaults,subvol=@,compress=zstd:1,discard=async        0  0
# UUID=052ec665-cf5d-4372-bb65-1b82237b9101      /home      btrfs  defaults,subvol=@home,compress=zstd:1,discard=async    0  0
```

Note that your PARTUUID and UUID numbers will be different. The last two lines for `/` and `/home` are the important ones.

### Changes to crypttab

As we use `discard=async`, we need to add `discard` to the `crypttab`:

```sh
sed -i 's/luks/luks,discard/' /mnt/@/etc/crypttab
cat /mnt/@/etc/crypttab
# cryptdata UUID=52d31097-e125-46f0-a139-85087e1b5565 none luks,discard
# cryptswap UUID=8cd56bf1-1a43-49c3-98b0-835b658b54fc /dev/urandom swap,plain,offset=1024,cipher=aes-xts-plain64,size=512
```
Here we can also see that the swap partition is encrypted and mounted to a device called `cryptswap`.

### Adjust configuration of kernelstub

We need to adjust some settings for the systemd boot manager and also make sure these settings are not overwritten if we install or update kernels and modules. Namely, we need to add `rootflags=subvol=@` to the `"user"` section of the kernelstub configuration file:

```sh
nano /mnt/@/etc/kernelstub/configuration
```

Here you need to add `rootflags=subvol=@` to the `"user"` kernel options. That is, your configuration file should look like this:

```sh
cat /mnt/@/etc/kernelstub/configuration
# {
#   "default": {
#     "kernel_options": [
#       "quiet",
#       "splash"
#     ],
#     "esp_path": "/boot/efi",
#     "setup_loader": false,
#     "manage_mode": false,
#     "force_update": false,
#     "live_mode": false,
#     "config_rev":3
#   },
#   "user": {
#     "kernel_options": [
#       "quiet",
#       "loglevel=0",
#       "systemd.show_status=false",
#       "splash",
#       "rootflags=subvol=@"
#     ],
#     "esp_path": "/boot/efi",
#     "setup_loader": true,
#     "manage_mode": true,
#     "force_update": false,
#     "live_mode": false,
#     "config_rev":3
#   }
# }
```

**VERY IMPORTANTLY: Don't forget to put a comma after** `"splash"` in the line above the added `"rootflags=subvol=@"` option, which ends without a comma. Otherwise you will get errors when you later run `update-initramfs` (see below)!

### Adjust configuration of systemd bootloader

We need to adjust some settings for the systemd boot manager as well, so let's mount our EFI partition

```sh
mount /dev/sda1 /mnt/@/boot/efi
```

Add `rootflags=subvol=@` to the last line of `Pop_OS_current.conf` either using a text editor or the following command

```sh
sed -i 's/splash/splash rootflags=subvol=@/' /mnt/@/boot/efi/loader/entries/Pop_OS-current.conf
cat /mnt/@/boot/efi/loader/entries/Pop_OS-current.conf
# title Pop!_OS
# linux /EFI/Pop_OS-UUID_of_data-root/vmlinuz.efi
# initrd /EFI/Pop_OS-UUID_of_data-root/initrd.img
# options root=UUID=UUID_of_data-root ro quiet loglevel=0 systemd.show_status=false splash rootflags=subvol=@
```

where `UUID_of_data-root` is the UUID of `/dev/mapper/data-root`.

Optionally, I like to add a timeout to the systemd boot menu in order to easily access the recovery partition:

```sh
echo "timeout 3" >> /mnt/@/boot/efi/loader/loader.conf
cat /mnt/@/boot/efi/loader/loader.conf 
# default Pop_OS-current
# timeout 3
```

### Create a chroot environment and update initramfs

Now, let's create a chroot environment, which enables one to work directly inside the newly installed OS, without actually booting into it. For this, unmount the top-level root filesystem from `/mnt` and remount the subvolume `@` to `/mnt`:

```sh
cd /
umount -l /mnt
mount -o subvol=@,defaults,compress=zstd:1,discard=async /dev/mapper/data-root /mnt
ls /mnt
# bin boot dev etc home lib lib32 lib64 libx32 media mnt opt proc recovery root run sbin srv sys tmp usr var
```

Then the following commands will put us into our system using chroot (taken from System76's help post on how to [Repair the Bootloader](https://support.system76.com/articles/bootloader/#systemd-boot)):

```sh
for i in /dev /dev/pts /proc /sys /run; do mount -B $i /mnt$i; done
chroot /mnt
```

We are now inside the new system, so let's check whether our `fstab` mounts everything correctly:

```sh
mount -av
# /boot/efi                : successfully mounted
# /recovery                : successfully mounted
# none                     : ignored
# /                        : ignored
# /home                    : successfully mounted
```

Looks good! Now we need to update the initramfs to make it aware of our changes to the kernelstub:

```sh
update-initramfs -c -k all
# update-initramfs: Generating /boot/initrd.img-5.17.5-76051705-generic
# kernelstub.Config    : INFO     Looking for configuration...
# kernelstub           : INFO     System information: 
# 
#     OS:..................Pop!_OS 22.04
#     Root partition:....../dev/dm-2
#     Root FS UUID:........052ec665-cf5d-4372-bb65-1b82237b9101
#     ESP Path:............/boot/efi
#     ESP Partition:......./dev/sda1
#     ESP Partition #:.....1
#     NVRAM entry #:.......-1
#     Boot Variable #:.....0000
#     Kernel Boot Options:.quiet loglevel=0 systemd.show_status=false splash rootflags=subvol=@
#     Kernel Image Path:.../boot/vmlinuz-5.17.5-76051705-generic
#     Initrd Image Path:.../boot/initrd.img-5.17.5-76051705-generic
#     Force-overwrite:.....False
#
# kernelstub.Installer : INFO     Copying Kernel into ESP
# kernelstub.Installer : INFO     Copying initrd.img into ESP
# kernelstub.Installer : INFO     Setting up loader.conf configuration
# kernelstub.Installer : INFO     Making entry file for Pop!_OS
# kernelstub.Installer : INFO     Backing up old kernel
# kernelstub.Installer : INFO     No old kernel found, skipping
```

Note that if you run into errors like this:

```sh
kernelstub.Config    : INFO     Looking for configuration...
Traceback (most recent call last):
  File "/usr/bin/kernelstub", line 244, in <module>
    main()
  File "/usr/bin/kernelstub", line 241, in main
    kernelstub.main(args)
  File "/usr/lib/python3/dist-packages/kernelstub/application.py", line 142, in main
    config = Config.Config()
  File "/usr/lib/python3/dist-packages/kernelstub/config.py", line 50, in __init__
    self.config = self.load_config()
  File "/usr/lib/python3/dist-packages/kernelstub/config.py", line 60, in load_config
    self.config = json.load(config_file)
  File "/usr/lib/python3.9/json/__init__.py", line 293, in load
    return loads(fp.read(),
  File "/usr/lib/python3.9/json/__init__.py", line 346, in loads
    return _default_decoder.decode(s)
  File "/usr/lib/python3.9/json/decoder.py", line 337, in decode
    obj, end = self.raw_decode(s, idx=_w(s, 0).end())
  File "/usr/lib/python3.9/json/decoder.py", line 353, in raw_decode
    obj, end = self.scan_once(s, idx)
json.decoder.JSONDecodeError: Expecting ',' delimiter: line 20 column 7 (char 363)
run-parts: /etc/initramfs/post-update.d//zz-kernelstub exited with return code 1
```

you probably forgot a comma after `"splash"` in the `/etc/kernelstub/configuration` file (see above).

## Step 4: Reboot, some checks, and system updates

Now, it is time to exit the chroot.

```sh
exit
```

Close the terminal and finally hit `Reboot Device` on the installer app. Cross your fingers! If all went well you should see a passphrase prompt (YAY!), where you enter the luks passphrase and your system should boot.

Now let's click through the welcome screen and see whether everything is set up correctly. In a terminal:

```sh
sudo mount -av
# /boot/efi                : already mounted
# /recovery                : already mounted
# none                     : ignored
# /                        : ignored
# /home                    : already mounted
```

All the entries in the `fstab` are mounted correctly.

```sh
sudo mount -v | grep /dev/mapper
# /dev/mapper/data-root on / type btrfs (rw,relatime,compress=zstd:1,ssd,discard=async,space_cache=v2,subvolid=256,subvol=/@)
# /dev/mapper/data-root on /home type btrfs (rw,relatime,compress=zstd:1,ssd,discard=async,space_cache=v2,subvolid=257,subvol=/@home)
```

Our optimized btrfs mount options were passed on and are used correctly. Note that you cannot have different mount options on the same partition.

```sh
sudo swapon
# NAME      TYPE      SIZE USED PRIO
# /dev/dm-2 partition   4G   0B   -2
```

The encrypted swap partition is in use.

```sh
sudo btrfs filesystem show /
# Label: none  uuid: 052ec665-cf5d-4372-bb65-1b82237b9101
# 	Total devices 1 FS bytes used 6.33GiB
# 	devid    1 size 47.39GiB used 8.02GiB path /dev/mapper/data-root

sudo btrfs subvolume list /
# ID 256 gen 79 top level 5 path @
# ID 257 gen 79 top level 5 path @home
```
These two btrfs commands tell us which disk is in use and which subvolumes are available.

If you have installed POP!_OS on a SSD or NVME, enable `fstrim.timer` as [both fstrim and discard=async mount option can peacefully co-exist](https://www.phoronix.com/scan.php?page=news_item&px=Fedora-Btrfs-Opts-Discard-Comp):

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

Finally, do another reboot.

## Step 5: Install timeshift and timeshift-autosnap-apt

Install timeshift and configure it directly via the GUI:

```sh
sudo apt install -y timeshift
sudo timeshift-gtk
```

* Select "btrfs" as the "Snapshot Type"; continue with "Next"
* Choose your btrfs system partition as "Snapshot Location"; continue with "Next"
* "Select Snapshot Levels" (type and number of snapshots that will be automatically created and managed/deleted by timeshift), my recommendations:
  * Activate "Monthly" and set it to 2
  * Activate "Weekly" and set it to 3
  * Activate "Daily" and set it to 5
  * Deactivate "Hourly"
  * Activate "Boot" and set it to 5
  * Activate "Stop cron emails for scheduled tasks"
  * continue with "Next"
  * I doinclude the `@home` subvolume (which is not selected by default). Note that when you restore a snapshot with timeshift you get to choose whether you want to restore @home as well (which in most cases you actually don't want to do!). But having snapshots of my home folder is quite convenient.
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

Now, to also automatically create timeshift snapshots when updating our system (or any other apt installation like installing or removing apps), let's install *timeshift-autosnap-apt* from GitHub

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

For example, as we don't have a dedicated `/boot` partition, we can set `snapshotBoot=false` in the `timeshift-autosnap-apt-conf` file such that the `/boot` directory is not rsync'ed to `/boot.backup`. Note that the EFI partition will be rsynced into `/boot.backup/efi`. So if something goes wrong with the EFI partition, you always have a backup of it as well. Moreover, POP!_OS does not use GRUB so we can set `updateGrub=false`.

Check if everything is working:

```
sudo timeshift-autosnap-apt
# Rsyncing /boot/efi into the filesystem before the call to timeshift.
# Using system disk as snapshot device for creating snapshots in BTRFS mode
# 
# /dev/dm-0 is mounted at: /run/timeshift/backup, options: rw,relatime,compress=zstd:3,ssd,space_cache,commit=120,subvolid=5,subvol=/
# 
# Creating new backup...(BTRFS)
# Saving to device: /dev/dm-0, mounted at path: /run/timeshift/backup
# Created directory: /run/timeshift/backup/timeshift-btrfs/snapshots/2022-05-24_11-15-25
# Created subvolume snapshot: /run/timeshift/backup/timeshift-btrfs/snapshots/2022-05-24_11-15-25/@
# Created subvolume snapshot: /run/timeshift/backup/timeshift-btrfs/snapshots/2022-05-24_11-15-25/@home
# Created control file: /run/timeshift/backup/timeshift-btrfs/snapshots/2022-05-24_11-15-25/info.json
# BTRFS Snapshot saved successfully (0s)
# Tagged snapshot '2022-05-24_11-15-25': ondemand
```

Now, if you run `sudo apt install|remove|upgrade|dist-upgrade`, *timeshift-autosnap-apt* will create a snapshot of your system with *timeshift*.

## Step 6: Practice recovery and system rollback
Now let's practice what to do in the event of a system disaster. Note that we just created snapshots to which we can always rollback. So as a practice case, let's delete our `/etc` folder, which of course you should never do:

```sh
sudo rm -rf /etc
```
Now try to reboot and you will notice that the boot process obviously gets stuck because the system is broken. So instead boot into POP!_OS's Recovery System. Then go to the File Manager and to Other locations. Select your encrypted disk and enter your luks passphrase to decrypt it. Note that this mounts the top-level root of your system, so you can either now directly access the broken files and move them back or simply use timeshift to rollback. I will show you both approaches.

### Rollback with timeshift
Install timeshift either from the Software center or using the terminal:

```sh
sudo apt install timeshift
```
Open Timeshift, select BTRFS and your disk and you will see the snapshots we created. Select one and hit `Restore`. Timeshift will then rename and move your current broken `@` subfolder away and replace it with the snapshot that you just selected. Reboot and all is back to normal! Easy huh?!

### Rollback manually
Open a terminal and go to the mounted folder.
```sh
cd /media/recovery/052ec665-cf5d-4372-bb65-1b82237b9101
ls
# @ @home timeshift-btrfs
```
The folder name is based on the UUID of the mounted device. Next, move the broken subvolume away:
```sh
sudo mv @ @.broken
```
Find the snapshot that you want to reuse in the folder `timeshift-btrfs/snapshots/`
```sh
ls timeshift-btrfs/snapshots
#   2022-05-25_13-12-45   2022-05-25_13-13-48   2022-05-25_13-17-17
```
For example, I want to rollback to the most recent one from `2022-05-25_13-17-17`. To do this, make a snapshot of the subvolume `@` which is inside this folder, call it `@` and create it at the top-level:
```sh
sudo btrfs subvolume snapshot timeshift-btrfs/snapshots/2022-05-25_13-17-17/@ @
# Create a snapshot of 'timeshift-btrfs/snapshots/2022-05-25_13-17-17/@' in './@'
ls /media/recovery/052ec665-cf5d-4372-bb65-1b82237b9101
# @ @.broken @home timeshift-btrfs
```
To sum up, we replaced the broken `@` subovlume with a good one. Reboot and all is back to normal! Easy huh?!

If all went fine, and you are back in your system, you should delete the snapshot using
```sh
btrfs subvolume delete @.broken
```
in order to save space.

**FINISHED! CONGRATULATIONS AND THANKS FOR STICKING THROUGH!**

**Check out my [Pop!_OS post-installation steps](../pop-os-post-install).**