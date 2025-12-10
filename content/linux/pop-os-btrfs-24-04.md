---
title: 'Pop!_OS 24.04: installation guide with BTRFS, LUKS encryption and auto snapshots with Timeshift'
summary: In this guide, I will walk you through the installation procedure to set up a Pop!_OS 24.04 system with a LUKS-encrypted partition. This partition will contain an LVM with a logical volume for the root filesystem formatted with BTRFS, including subvolumes `@` for `/` and `@home` for `/home`. I will show you how to optimize BTRFS mount options to support compression and set up an encrypted swap partition. Additionally, the Pop!_OS recovery system will be installed and accessible via the systemd bootloader. Finally, we will configure Timeshift to automatically take system snapshots.
header:
  image: "Linux_Pop_OS!_penguin_Tux.png"
  caption: "Image credit: [**Linux_Pop_OS!_penguin_Tux by Jayaguru-Shishya**](https://commons.wikimedia.org/wiki/File:Linux_Pop_OS!_penguin_Tux.png)"
tags: ["linux", "pop-os", "install guide", "btrfs", "luks", "timeshift"]
date: 2024-12-12
type: book
---
***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev). Pull requests are very much appreciated.***
<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

{{< youtube  >}}
*Note that this written guide is an updated version of the video and contains much more information.*
{{< toc hide_on="xl" >}}

## Overview

In this guide, I will show you how to install Pop!_OS 24.04 with the following structure:

* An unencrypted EFI partition for the systemd bootloader.
* An unencrypted partition for the Pop!_OS recovery system.
* An encrypted swap partition (note: hibernation is [not supported by default](https://support.system76.com/articles/enable-hibernation/)).
* An encrypted BTRFS partition (with LVM) for the root filesystem.
  * The BTRFS logical volume contains a subvolume `@` for `/` and a subvolume `@home` for `/home`.
* Automatic system snapshots and easy rollback using [Timeshift](https://github.com/linuxmint/timeshift), which will regularly take (almost instant) snapshots of the system.

This setup works similarly well on other distributions, for which I also have [installation guides (with optional RAID1)](../../linux).

## Step 0: General remarks

This tutorial uses Pop!_OS 24.04 from [System76](https://system76.com/pop), installed via a USB flash device. Other versions of Pop!_OS and distributions using the systemd boot manager might also work but may require additional steps (see my other [installation guides](../../linux)).

{{< callout warning >}}
**I strongly advise trying the following installation steps in a virtual machine first before performing them on real hardware!** For instance, you can spin up a virtual machine using the awesome [quickemu](https://github.com/quickemu-project/quickemu) project.
{{< /callout >}}

## Step 1: Prepare partitions by performing a Clean Install first

To maintain the default partition layout of Pop!_OS,[^1] the easiest and quickest approach is to perform the installation twice:

[^1]: If you already have (a previous version of) Pop!_OS installed, you can safely skip this step as you already have a partition layout that works with the installer.

1.  Run the automatic `Clean Install` with encryption. This creates the LUKS-encrypted LVM volume group with a logical volume called `root` containing the actual system files formatted with ext4.
2.  Perform a second installation using the `Custom (Advanced)` option. This allows us to select and format the partitions as needed. While we can customize the partitions, I prefer to keep them close to the defaults and only change the filesystem to BTRFS.

First, run the automatic `Clean Install` with encryption.

{{< callout warning >}}
When the installation finishes, do **NOT** select `Restart Device`. Instead, right-click the `Install Pop!_OS` app in the dock and select `Quit`.
{{< /callout >}}

If you want to understand the structure of the installation, keep reading. Otherwise, proceed to the next step to perform the second installation.

### [Optional] Understand the default partition layout and installation structure

Open a terminal and examine the default partition layout (alternatively, use Gparted):

```fish
sudo lsblk
# NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
# loop0         7:0    0   2.4G  1 loop /rofs
# sda           8:0    0   3.6T  0 disk
# sdb           8:16   0   3.6T  0 disk
# sdc           8:32   0 119.2G  0 disk
# ├─sdc1        8:33   0  1022M  0 part
# ├─sdc2        8:34   0     4G  0 part
# ├─sdc3        8:35   0 110.2G  0 part
# └─sdc4        8:36   0     4G  0 part
# sdd           8:48   1     0B  0 disk
# sde           8:64   1     0B  0 disk
# sdf           8:80   1     0B  0 disk
# sdg           8:96   1     0B  0 disk
# sdh           8:112  1  29.3G  0 disk
# ├─sdh1        8:113  1   2.8G  0 part /cdrom
# ├─sdh2        8:114  1     4M  0 part
# └─sdh3        8:115  1  26.5G  0 part /var/crash
#                                       /var/log
# sdi           8:128  0   1.4T  0 disk
# sr0          11:0    1  1024M  0 rom
# sr1          11:1    1  1024M  0 rom
# sr2          11:2    1  1024M  0 rom
# sr3          11:3    1  1024M  0 rom
# zram0       251:0    0    16G  0 disk [SWAP]
# nvme0n1     259:0    0   1.7T  0 disk
# ├─nvme0n1p1 259:1    0    16M  0 part
# ├─nvme0n1p2 259:2    0  99.6G  0 part
# ├─nvme0n1p3 259:3    0   9.8G  0 part
# └─nvme0n1p4 259:4    0   1.6T  0 part
```

I have installed Pop!_OS on the 119.2 GB SSD, recognized as `sdc` on my machine. Note that I have several other disks connected, so we must identify the correct disk carefully.

Let's look closer at the partition layout of `sdc`:

```fish
sudo parted /dev/sdc unit MiB print
# Model: ATA ThinkSystem M.2 (scsi)
# Disk /dev/sdc: 122040MiB
# Sector size (logical/physical): 512B/512B
# Partition Table: gpt
# Disk Flags:
#
# Number  Start      End        Size       File system     Name      Flags
#  1      2.00MiB    1024MiB    1022MiB    fat32                     boot, esp
#  2      1024MiB    5120MiB    4096MiB    fat32           recovery  msftdata
#  3      5120MiB    117942MiB  112822MiB
#  4      117942MiB  122038MiB  4096MiB    linux-swap(v1)            swap
```

We have the following 4 partitions:

1.  A 1022 MiB FAT32 EFI partition for the systemd bootloader (note the `boot, esp` flag).
2.  A 4096 MiB FAT32 partition for the Pop!_OS recovery system (note the name `recovery`).
3.  A 112822 MiB partition containing the actual system files.
4.  A 4096 MiB swap partition for (encrypted) swap use (note the `swap` flag).

Let's examine the encrypted `sdc3` partition:

```fish
sudo cryptsetup luksDump /dev/sdc3
# LUKS header information
# Version:        2
# Epoch:          3
# Metadata area:  16384 [bytes]
# Keyslots area:  16744448 [bytes]
# UUID:           0be45abc-4d9f-4682-9a51-17432c068ef2
# Label:          (no label)
# Subsystem:      (no subsystem)
# Flags:          (no flags)
#
# Data segments:
#   0: crypt
#       offset: 16777216 [bytes]
#       length: (whole device)
#       cipher: aes-xts-plain64
#       sector: 512 [bytes]
```

This confirms the partition is encrypted with LUKS using default options. Now, let's see what is inside the encrypted partition:

```fish
sudo cryptsetup luksOpen /dev/sdc3 cryptdata
# Enter passphrase for /dev/sdc3:
ls /dev/mapper
# control  cryptdata  data-root
sudo pvs
#  PV                    VG   Fmt  Attr PSize   PFree
#  /dev/mapper/cryptdata data lvm2 a--  110.16g    0
sudo vgs
#  VG   #PV #LV #SN Attr   VSize   VFree
#  data   1   1   0 wz--n- 110.16g    0
sudo lvs
#  LV   VG   Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
#  root data -wi-a----- 110.16g
sudo lsblk /dev/mapper/data-root -f
# NAME      FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
# data-root ext4   1.0         2e9d6dac-1ee4-419c-b21c-8212262fdb93
```

By default, when installing with encryption, Pop!_OS uses [Logical Volume Management (LVM)](https://askubuntu.com/questions/3596/what-is-lvm-and-what-is-it-used-for). The encrypted partition (`cryptdata`) is a physical volume containing a volume group called `data`. Inside this volume group, there is a logical volume called `root` containing our system files, formatted with ext4.

While I don't use LVM features extensively, the installer requires LVM for encryption, and there is practically no performance downside.

Now that we know the partition layout, let's close everything:
```fish
sudo cryptsetup luksClose /dev/mapper/data-root
sudo cryptsetup luksClose /dev/mapper/cryptdata
ls /dev/mapper
# control
```
We are ready to proceed with the second install, which follows the same steps but uses BTRFS as the underlying filesystem.

## Step 2: Install Pop!_OS using the `Custom (Advanced)` option

Open `Install Pop!_OS` from `Applications` again, and select the region, language, and keyboard layout. Then choose `Custom (Advanced)`.

You will see your partitioned hard disk (for me, `/dev/sdc`) as shown in the previous step:

*   **First partition:** Click it, activate `Use partition`, activate `Format`, set **Use as** to `Boot /boot/efi`, and **Filesystem** to `fat32`.
*   **Second partition:** Click it, activate `Use partition`, activate `Format`, set **Use as** to `Custom` and enter `/recovery`, set **Filesystem** to `fat32`.
*   **Fourth partition:** Click it, activate `Use partition`, set **Use as** to `Swap`.
*   **Third (largest) partition:** Click it. A `Decrypt This Partition` dialog opens; enter your LUKS password and hit `Decrypt`. A new device called `LVM data` will appear at the bottom of the screen (you might need to scroll down). Click on this partition, activate `Use partition`, activate `Format`, set **Use as** to `Root (/)`, and **Filesystem** to `btrfs`.

*If you have other partitions, check their types and usage. Ensure you deactivate using or changing any other EFI partitions.*

Recheck everything (ensure the correct use of partitions that have a black checkmark) and hit `Erase and Install`.
Follow the steps to create a user account and write changes to the disk.

{{< callout warning >}}
Once the installer finishes, do **NOT** select `Restart Device`, but keep the window open.
{{< /callout >}}



## Step 3: Configure BTRFS subvolumes and mount options

Open a terminal and switch to an interactive root session:

```fish
sudo -i
```
Maximizing the terminal window helps when working with the command line.

### Mount the BTRFS top-level root filesystem with zstd compression

Mount the root partition (the top-level BTRFS volume always has id 5) with compression enabled to optimize performance and durability:

```fish
cryptsetup luksOpen /dev/sdc3 cryptdata
# Enter passphrase for /dev/sdc3
mount -o subvolid=5,defaults,compress=zstd:1 /dev/mapper/data-root /mnt
```

By default, Pop!_OS 24.04 uses standard BTRFS mount options. SSDs are automatically detected (`ssd` mount option), and `space_cache=v2` is used (also the [default in Fedora](https://pagure.io/fedora-btrfs/project/issue/24)).
There is some debate about using [`noatime` instead of `relatime`](https://pagure.io/fedora-btrfs/project/issue/9). I haven't seen a significant difference, so I use the default `relatime`.
However, I recommend using `compress=zstd:1` (specifically level 1) for SSDs, as recommended by the [Fedora team for workstations](https://fedoraproject.org/wiki/Changes/BtrfsTransparentCompression#Simple_Analysis_of_btrfs_zstd_compression_level).

{{< callout note >}}
**Note on `discard=async`:** Since Linux kernel 6.2, BTRFS [enables `discard=async` by default](https://btrfs.readthedocs.io/en/latest/ch-mount-options.html) on devices that support TRIM operations. Pop!_OS 24.04 ships with a 6.x kernel, so there is no need to explicitly add `discard=async` to the mount options—it is automatically applied. If you need to disable it for some reason, use the `nodiscard` option.
{{< /callout >}}

We will add these mount options to `fstab` later, but it's good practice to use compression now when moving system files into the subvolumes.

{{< callout note >}}
If the LVM group is not activated, see [this issue for help](https://github.com/wmutschl/mutschler.dev/issues/4).
{{< /callout >}}

### Create BTRFS subvolumes `@` and `@home`

First, create the subvolume `@`:
```fish
btrfs subvolume create /mnt/@
# Create subvolume '/mnt/@'
```

Next, move all files and folders from the top-level filesystem into `@`:
```fish
cd /mnt
ls | grep -v @ | xargs mv -t @
ls -a /mnt
# . .. @
```
Since we mounted the drive with compression enabled, the data is automatically compressed as it is moved.

Now, create the `@home` subvolume and move the user folder from `/mnt/@/home/` into it:

```fish
btrfs subvolume create /mnt/@home
# Create subvolume '/mnt/@home'
mv /mnt/@/home/* /mnt/@home/
```

Verify that everything has been moved correctly:
```fish
ls -a /mnt/@/home
# . ..
ls -a /mnt/@home
# . .. wmutschl
btrfs subvolume list /mnt
# ID 256 gen 17 top level 5 path @
# ID 257 gen 17 top level 5 path @home
```

### Changes to fstab

We need to update `/etc/fstab` to:

*   Mount `/` to the `@` subvolume.
*   Mount `/home` to the `@home` subvolume.
*   Enable compression.

Open `fstab` with a text editor (e.g., `nano /mnt/@/etc/fstab`) or use these `sed` commands:

```fish
sed -i 's/btrfs  defaults  0  1/btrfs  defaults,compress=zstd:1,subvol=@  0  0/' /mnt/@/etc/fstab
echo "UUID=$(blkid -s UUID -o value /dev/mapper/data-root)  /home  btrfs  defaults,compress=zstd:1,subvol=@home   0 0" >> /mnt/@/etc/fstab
```

Your `fstab` should look like this:

```fish
cat /mnt/@/etc/fstab
# PARTUUID=2a345427-756a-454d-943b-6028c9e5cf55  /boot/efi  vfat  umask=0077  0  0
# PARTUUID=526a5925-7e0f-44ff-9a69-da10eb0f1c5c  /recovery  vfat  umask=0077  0  0
# /dev/mapper/cryptswap  none  swap  defaults  0  0
# UUID=f4190602-7a0b-4d6c-aed5-624a17afaf8f  /  btrfs  defaults,compress=zstd:1,subvol=@  0  0
# UUID=f4190602-7a0b-4d6c-aed5-624a17afaf8f  /home  btrfs  defaults,compress=zstd:1,subvol=@home   0 0
```

Note that your UUIDs will be different. The last two lines are the important ones.

{{< callout note >}}
**Note on `discard` in crypttab:** You may notice that Pop!_OS does not add a `discard` option to `/etc/crypttab` for the LUKS-encrypted partition. This is intentional for security reasons: enabling discard on encrypted devices can expose patterns about which blocks are unused, potentially leaking metadata about the encrypted content. Pop!_OS prioritizes security over the marginal performance benefit. If you prefer to enable TRIM passthrough for performance reasons and accept this trade-off, you can manually add `discard` to the crypttab entry for `cryptdata`, see my [guide for POP!_OS 22.04](../../linux/pop-os-btrfs-22-04#changes-to-crypttab).
{{< /callout >}}

### Adjust configuration of kernelstub

We need to adjust settings for the systemd boot manager and ensure they persist after kernel updates. Add `rootflags=subvol=@` to the `"user"` kernel options in the kernelstub configuration file:

```fish
nano /mnt/@/etc/kernelstub/configuration
```

Your configuration file should look like this (add the `rootflags=subvol=@` line to the `user` section):

```fish
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
#     "config_rev": 3
#   },
#   "user": {
#     "kernel_options": [
#       "quiet",
#       "loglevel=0",
#       "systemd.show_status=false",
#       "splash",
#       "rootflags=subvol=@",
#       ""
#     ],
#     "esp_path": "/boot/efi",
#     "setup_loader": true,
#     "manage_mode": true,
#     "force_update": false,
#     "live_mode": false,
#     "config_rev": 3
#   }
# }
```

{{< callout warning >}}
VERY IMPORTANT: Don't forget the comma at the end of the line, otherwise `update-initramfs` will fail later!
{{< /callout >}}

Alternatively, you can use this `sed` command to apply the change:
```fish
sed -i '/\"user\"/,/}/{ s/\(\"splash\",\)/\1\n      \"rootflags=subvol=@\",/ }' /mnt/@/etc/kernelstub/configuration
```

### Adjust configuration of systemd bootloader

Mount the EFI partition to adjust systemd boot settings:

```fish
mount /dev/sdc1 /mnt/@/boot/efi
```

Add `rootflags=subvol=@` to the last line of `Pop_OS_current.conf`:

```fish
sed -i 's/splash/splash rootflags=subvol=@/' /mnt/@/boot/efi/loader/entries/Pop_OS-current.conf
cat /mnt/@/boot/efi/loader/entries/Pop_OS-current.conf
# title Pop!_OS
# linux /EFI/Pop_OS-f4190602-7a0b-4d6c-aed5-624a17afaf8f/vmlinuz.efi
# initrd /EFI/Pop_OS-f4190602-7a0b-4d6c-aed5-624a17afaf8f/initrd.img
# options root=UUID=f4190602-7a0b-4d6c-aed5-624a17afaf8f ro quiet loglevel=0 systemd.show_status=false splash rootflags=subvol=@
```

Optionally, add a timeout to the systemd boot menu to easily access the recovery partition:

```fish
echo "timeout 3" >> /mnt/@/boot/efi/loader/loader.conf
cat /mnt/@/boot/efi/loader/loader.conf
# default Pop_OS-current
# timeout 3
```

### Create a chroot environment and update initramfs

To work inside the newly installed OS without booting into it, create a chroot environment.
Unmount the top-level root filesystem (id 5) and remount the subvolume `@` to `/mnt`:

```fish
cd /
umount -l /mnt
mount -o subvol=@,defaults,compress=zstd:1 /dev/mapper/data-root /mnt
ls /mnt
# bin  bin.usr-is-merged  boot  dev  etc  home  lib  lib.usr-is-merged  lib64  media  mnt  opt  proc  recovery  root  run  sbin  sbin.usr-is-merged  srv  sys  tmp  usr  var
```

Mount the necessary system directories and enter chroot (commands from System76's [Repair the Bootloader](https://support.system76.com/articles/bootloader/#systemd-boot) guide):

```fish
for i in /dev /dev/pts /proc /sys /run; do mount -B $i /mnt$i; done
chroot /mnt
```

Now inside the new system, verify the `fstab` mounts:

```fish
mount -av
# mount: (hint) your fstab has been modified, but systemd still uses
#        the old version; use 'systemctl daemon-reload' to reload.
# /boot/efi                : successfully mounted
# /recovery                : successfully mounted
# none                     : ignored
# /                        : ignored
# /home                    : successfully mounted
```

Update the initramfs to include the kernelstub changes:

```fish
update-initramfs -c -k all
# update-initramfs: Generating /boot/initrd.img-6.16.3-76061603-generic
# W: /sbin/fsck.btrfs doesn't exist, can't install to initramfs
# mount: (hint) your fstab has been modified, but systemd still uses
#        the old version; use 'systemctl daemon-reload' to reload.
# Updating kernel version 6.16.3-76061603-generic in systemd-boot...
# kernelstub.Config    : INFO     Looking for configuration...
# kernelstub           : INFO     System information:
#
#     OS:..................Pop!_OS 24.04
#     Root partition:....../dev/dm-1
#     Root FS UUID:........f4190602-7a0b-4d6c-aed5-624a17afaf8f
#     ESP Path:............/boot/efi
#     ESP Partition:......./dev/sdc1
#     ESP Partition #:.....1
#     NVRAM entry #:.......-1
#     Boot Variable #:.....0000
#     Kernel Boot Options:.quiet loglevel=0 systemd.show_status=false splash rootflags=subvol=@
#     Kernel Image Path:.../boot/vmlinuz-6.16.3-76061603-generic
#     Initrd Image Path:.../boot/initrd.img-6.16.3-76061603-generic
#     Force-overwrite:.....False
#
# kernelstub.Installer : INFO     Copying Kernel into ESP
# kernelstub.Installer : INFO     Copying initrd.img into ESP
# kernelstub.Installer : INFO     Setting up loader.conf configuration
# kernelstub.Installer : INFO     Making entry file for Pop!_OS
# kernelstub.Installer : INFO     Backing up old kernel
# kernelstub.Installer : INFO     No old kernel found, skipping
```

If you see errors, check that you added the comma in the `/etc/kernelstub/configuration` file.

Note the warning about `/sbin/fsck.btrfs`, so let's install `btrfs-progs` to be able to manage BTRFS subvolumes and fix the issue (this triggers another `update-initramfs`):

```fish
sudo apt install -y btrfs-progs
```

Exit the chroot:

```fish
exit
```

## Step 4: Reboot, some checks, and system updates

Close the terminal and click `Reboot Device` on the installer app.
Crossing fingers!
If all goes well, you will see a passphrase prompt. Enter your LUKS passphrase, and your system should boot.

After the welcome screen, we go to settings and:

*   **Network & Wireless**: check your connection, for example deactivate unused interfaces and add IP configuration to used interface or add Wifi password.
*   **Power & Battery**: Use `High performance` in `Power Mode` and check `Power Saving Options` (on a server I deactivate them, on a notebook I keep them).

Next, we verify the setup in a terminal:

```fish
sudo mount -av
# /boot/efi                : already mounted
# /recovery                : already mounted
# none                     : ignored
# /                        : ignored
# /home                    : already mounted
```

Check that the optimized mount options are active (note that you cannot have different mount options on the same partition):

```fish
sudo mount -v | grep /dev/mapper
# /dev/mapper/data-root on / type btrfs (rw,relatime,compress=zstd:1,space_cache=v2,subvolid=256,subvol=/@)
# /dev/mapper/data-root on /home type btrfs (rw,relatime,compress=zstd:1,space_cache=v2,subvolid=257,subvol=/@home)
```

Verify swap is working:

Run `sudo swapon` to check if both the swap partition and the zram device are active:

```fish
sudo swapon
# NAME       TYPE      SIZE USED PRIO
# /dev/dm-2  partition   4G   0B   -2
# /dev/zram0 partition  16G   0B 1000
```

Pop!_OS uses **two swap mechanisms**:

1. **zram** (compressed RAM swap): A high-priority swap device that compresses data in RAM. This is used first due to its higher priority (1000) and provides fast swap performance for everyday use.
2. **Swap partition** (encrypted): A lower-priority disk-based swap partition used when zram is full.

{{< callout warning >}}
**About Hibernation:** Hibernation (suspend-to-disk) is **not officially supported** on Pop!_OS. According to [System76's documentation](https://support.system76.com/articles/enable-hibernation/), there are several reasons why hibernation is not enabled by default:

- **Non-persistent swap encryption key:** The swap partition is encrypted with a random key generated at each boot (see the `cryptswap` entry in `/etc/crypttab`). This means any data written to swap—including hibernation data—cannot be read after a reboot, making hibernation impossible without reconfiguration.
- **Zram incompatibility:** Zram exists only in volatile RAM and cannot persist hibernation data across power cycles.
- **Default partition layout:** The default 4GB swap partition may be insufficient for systems with more RAM (hibernation requires swap ≥ RAM size).
- **SSD wear:** Hibernation adds significant write traffic to SSDs (equal to total RAM each time), potentially shortening drive lifespan.

If you need hibernation, System76 provides a [guide to enable it](https://support.system76.com/articles/enable-hibernation/), which involves removing the default swap partition, creating a persistent encrypted swap volume inside LVM, and configuring the kernel resume parameter. This is beyond the scope of this guide.
{{< /callout >}}

Inspect BTRFS subvolumes:

```fish
sudo btrfs filesystem show /
# Label: none  uuid: f4190602-7a0b-4d6c-aed5-624a17afaf8f
#         Total devices 1 FS bytes used 7.91GiB
#         devid    1 size 110.16GiB used 12.02GiB path /dev/mapper/data-root

sudo btrfs subvolume list /
# ID 256 gen 96 top level 5 path @
# ID 257 gen 96 top level 5 path @home
```

If using an SSD or NVMe, enable `fstrim.timer`:

```fish
sudo systemctl enable fstrim.timer
```

Make sure `issue_discards=1` is set in `/etc/lvm/lvm.conf` (usually default):

```fish
cat /etc/lvm/lvm.conf | grep issue_discards
# 	# Configuration option devices/issue_discards.
# 	issue_discards = 1
```

Finally, update the system including the recovery partition and flatpak applications:

```fish
sudo apt update
sudo apt upgrade
sudo apt dist-upgrade
sudo apt autoremove --purge
sudo apt autoclean
pop-upgrade recovery upgrade from-release
flatpak -vv update
```

I also recommend updating firmware:

```fish
sudo fwupdmgr get-devices
sudo fwupdmgr get-updates
sudo fwupdmgr update
```

Reboot once more:

```fish
sudo reboot now
```

## Step 5: Snapshot tools

With BTRFS set up with `@` and `@home` subvolumes, you can now use various snapshot and backup tools:

* **[Timeshift](https://github.com/linuxmint/timeshift):** A popular GUI tool for system snapshots. Note that Timeshift **requires** the `@` and `@home` subvolume naming convention we set up in this guide.
* **[grub-btrfs](https://github.com/Antynea/grub-btrfs):** Automatically adds GRUB menu entries for your snapshots, allowing you to boot directly into any snapshot.
* **[Btrbk](https://github.com/digint/btrbk):** A powerful tool for snapshot management and backup with support for incremental send/receive to remote locations. Personally, I prefer Btrbk for its flexibility and send/receive capabilities.
* **[Snapper](https://github.com/openSUSE/snapper):** Another snapshot management tool, popular in openSUSE.

We will now focus only on Timeshift as it is (in my opinion) the most user-friendly one.

### Install and configure Timeshift
Install [Timeshift](https://github.com/linuxmint/timeshift) and configure it via the GUI:

```fish
sudo apt update
sudo apt install -y timeshift
```
Go to `Applications` and search for `Timeshift`.

*   Select **BTRFS** as the **Snapshot Type**; click **Next**.
*   Select your BTRFS system partition as the **Snapshot Location**; click **Next**. Ignore the warning "Selected device does not have BTRFS partition"-this is a bug with encrypted devices.
*   **Select Snapshot Levels** (my recommendations):
    *   Activate **Monthly** and set to 2.
    *   Activate **Weekly** and set to 3.
    *   Activate **Daily** and set to 5.
    *   Deactivate **Hourly**.
    *   Activate **Boot** and set to 5.
    *   Activate **Stop cron emails for scheduled tasks**.
    *   Click **Next**.
*   **User Home Directories**: Include the `@home` subvolume (not selected by default). While you usually restore only `@`, having home backups is convenient.
*   Click **Finish**.
*   Create a manual snapshot named "Clean Install" and exit Timeshift.

Timeshift will now manage snapshots automatically.

### Verify snapshots

In a terminal, you can verify the snapshots:

```fish
sudo btrfs subvolume list /
# ID 256 gen 160 top level 5 path @
# ID 257 gen 157 top level 5 path @home
# ID 258 gen 153 top level 5 path timeshift-btrfs/snapshots/2025-12-09_10-37-12/@
# ID 259 gen 153 top level 5 path timeshift-btrfs/snapshots/2025-12-09_10-37-12/@home
```

## Step 6: Practice recovery and system rollback

Let's simulate a system failure to practice recovery. Note: We have snapshots to rollback to (in the subvolumes at the top-level root).

**Delete the `/etc` folder (simulating disaster):**

```fish
sudo rm -rf /etc
```

If you try to reboot, the system will fail. So instead, boot into the `Pop!_OS Recovery System` selected from the systemd bootloader (this is why I set the timeout to 3 seconds).

I will show you two ways to rollback: with Timeshift and manually.
For both, first open the File Manager, go to **Other Locations**, select your encrypted disk, and enter the passphrase. This mounts the top-level root and you can now access the snapshots.

### Rollback with Timeshift
1.  Install Timeshift in the live environment via the terminal:
    ```fish
    sudo apt update
    sudo apt install timeshift
    ```
2.  Go to `Applications` and open Timeshift.
3.  Select **BTRFS**, and choose your disk. Ignore the warning "Selected device does not have BTRFS partition"-this is a bug with encrypted devices.
4.  Select a snapshot and click **Restore**.
5.  Timeshift will restore the system subvolume. Reboot, and your system should be back to normal.

### Rollback manually
1.  Open a terminal and navigate to the mounted volume (e.g., `/media/recovery/<YOUR-UUID>`):
    ```fish
    sudo -i
    cd /media/recovery/<YOUR-UUID>
    ls
    # @ @home timeshift-btrfs
    ```
2.  Move the broken subvolume:
    ```fish
    sudo mv @ @.broken
    ```
3.  Find a valid snapshot in `timeshift-btrfs/snapshots/`:
    ```fish
    ls timeshift-btrfs/snapshots
    ```
4.  Create a snapshot of the good subvolume as the new `@` (this will also make the read-only subvolume writable):
    ```fish
    sudo btrfs subvolume snapshot timeshift-btrfs/snapshots/2025-12-09_09-59-43/@ @
    ```
5.  Reboot.

Once back in your system, delete the broken subvolume to save space:
```fish
sudo btrfs subvolume list /
sudo btrfs subvolume delete @.broken
```

**FINISHED! CONGRATULATIONS!**

**Check out my [Pop!_OS post-installation steps](../pop-os-post-install).**
