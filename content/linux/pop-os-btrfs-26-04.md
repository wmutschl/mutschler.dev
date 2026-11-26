---
title: 'Pop!_OS 26.04: installation guide with BTRFS, LUKS encryption and auto snapshots with Timeshift'
summary: In this guide, I will walk you through the installation procedure to set up a Pop!_OS 26.04 system with a LUKS-encrypted partition. This partition will contain an LVM with a logical volume for the root filesystem formatted with BTRFS, including subvolumes `@` for `/`, `@home` for `/home` and `@swap` for a swapfile. I will show you how to optimize BTRFS mount options to support compression and how to replace the installer's swapfile, which does not work on BTRFS, with one in its own subvolume that does not block snapshots. Additionally, the Pop!_OS recovery system will be installed and accessible via the systemd bootloader. Finally, we will configure Timeshift to automatically take system snapshots and practice a rollback.
header:
  image: "Linux_Pop_OS!_penguin_Tux.png"
  caption: "Image credit: [**Linux_Pop_OS!_penguin_Tux by Jayaguru-Shishya**](https://commons.wikimedia.org/wiki/File:Linux_Pop_OS!_penguin_Tux.png)"
tags: ["linux", "pop-os", "install guide", "btrfs", "luks", "timeshift"]
date: 2026-11-25
type: book
---
***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev).
Pull requests are very much appreciated.***
<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

*There is a [video of the procedure for Pop!_OS 24.04](https://www.youtube.com/watch?v=lz0S5lctMLU).
The idea is the same for 26.04, but some details differ; they are listed in [What is new in Pop!_OS 26.04](#what-is-new-in-pop_os-2604-for-this-guide).*
{{< toc hide_on="xl" >}}

## Overview

In this guide, I will show you how to install Pop!_OS 26.04 with the following structure:

* An unencrypted 4 GiB EFI partition for the systemd bootloader, the kernels and the initial RAM disks.
* An unencrypted 4 GiB partition for the Pop!_OS recovery system.
* An encrypted partition (LUKS with LVM) for the root filesystem, formatted with BTRFS:
  * a subvolume `@` for `/`,
  * a subvolume `@home` for `/home`,
  * a subvolume `@swap` for the swapfile, mounted at `/swap`.
* Compressed swap in RAM (zram) plus the swapfile on disk.
* Automatic system snapshots and easy rollback using [Timeshift](https://github.com/linuxmint/timeshift), which will regularly take (almost instant) snapshots of the system.

This setup works similarly well on other distributions, for which I also have [installation guides](../../linux).

## What is new in Pop!_OS 26.04 for this guide

Pop!_OS 26.04 is based on Ubuntu 26.04 LTS and ships the COSMIC desktop.
For this guide, the changes in the installer matter most (see the 26.04 changes to its [backend](https://github.com/pop-os/distinst/commits/master_resolute) and [frontend](https://github.com/pop-os/installer/commits/master_resolute)):

| | Pop!_OS 24.04 | Pop!_OS 26.04 |
|---|---|---|
| EFI partition | 1 GiB | 4 GiB; the installer refuses anything below 4 GB |
| Swap | 4 GiB encrypted swap partition (random key at every boot) | no swap partition; a swapfile `/swapfile` in the root filesystem (40% of RAM, at least 4 GiB) |
| Initial RAM disk | initramfs-tools | dracut; `update-initramfs` still exists as a wrapper |
| Unlocking the LUKS partition | `cryptsetup` scripts in the initramfs | `rd.luks.uuid=…` on the kernel command line |
| TRIM on the LUKS partition | off | on (`luks,discard` in `/etc/crypttab`), but only since an [installer change of 23 November 2026](https://github.com/pop-os/distinst/pull/358); we add it below if your ISO is older |
| Default kernel options | `quiet loglevel=0 systemd.show_status=false splash` | the same plus `threadirqs` |

The swapfile is the one change that needs extra work on BTRFS.
The kernel only accepts a swapfile on BTRFS if it is not copy-on-write, but the installer creates `/swapfile` with `fallocate` and `mkswap` only, so on BTRFS it fails to activate at every boot.
Even a correct swapfile in the root subvolume would get in the way, because BTRFS refuses to snapshot a subvolume that contains an active swapfile.
So we replace it with a swapfile in its own subvolume `@swap`, which Timeshift leaves alone.

{{< callout note >}}
**Upgrading from 24.04?**
If you upgrade an existing Pop!_OS 24.04 installation in place with `pop-upgrade`, your BTRFS layout, the encrypted swap partition and the 1 GiB EFI partition stay as they are; take a Timeshift snapshot before you start.
If you roll back to it, [refresh the boot files](#refresh-the-boot-files) afterwards, because the EFI partition keeps the kernel of 26.04.
This guide is for a fresh installation.
{{< /callout >}}

## Step 0: General remarks

This tutorial uses Pop!_OS 26.04 from [System76](https://system76.com/pop), installed via a USB flash device.
There is an ISO for systems with NVIDIA graphics and one for everything else; the steps are the same for both.
Verify the SHA256 checksum shown on the download page before you write the ISO to the USB flash device.
Other versions of Pop!_OS and distributions using the systemd boot manager might also work but may require additional steps (see my other [installation guides](../../linux)).

{{< callout note >}}
**Secure Boot:** Disable Secure Boot in your firmware settings, as System76's [download page](https://system76.com/download-pop/) asks for all Pop!_OS 26.04 ISOs.
With Secure Boot enabled, my machine stopped booting with `error: bad shim signature.` and `error: you need to load the kernel first.`, so I turned it off.
Support for it and manual signing are still an [open issue](https://github.com/pop-os/pop/issues/3395), in which users report failed boots, for example with the NVIDIA ISO.
{{< /callout >}}

{{< callout warning >}}
**I strongly advise trying the following installation steps in a virtual machine first before performing them on real hardware!**
For instance, you can spin up a virtual machine using the awesome [quickemu](https://github.com/quickemu-project/quickemu) project.
{{< /callout >}}

{{< callout warning >}}
**Device names:** I install Pop!_OS on the NVMe drive `/dev/nvme0n1`, so its partitions are `/dev/nvme0n1p1`, `/dev/nvme0n1p2` and `/dev/nvme0n1p3`.
Your disk may have a different name, for example `/dev/nvme1n1` if you have several NVMe drives, or `/dev/sda` for a SATA drive, whose partitions are called `/dev/sda1`, `/dev/sda2` and `/dev/sda3`.
Replace the names in **every** command below.
{{< /callout >}}

## Step 1: Prepare partitions by performing a Clean Install first

To maintain the default partition layout of Pop!_OS,[^1] the easiest and quickest approach is to perform the installation twice:

[^1]: If your disk already has the partition layout of a previous Pop!_OS 26.04 installation, you can skip this step.
    A disk with the layout of Pop!_OS 24.04 or older does not qualify: its 1 GiB EFI partition is smaller than the 4 GB the 26.04 installer requires.

1.  Run the automatic `Clean Install` with encryption.
    This creates the EFI and recovery partitions as well as the LUKS-encrypted LVM volume group with a logical volume called `root` containing the actual system files formatted with ext4.
2.  Perform a second installation using the `Custom (Advanced)` option.
    This allows us to select and format the partitions as needed.
    While we can customize the partitions, I prefer to keep them close to the defaults and only change the filesystem to BTRFS.

First, run the automatic `Clean Install` with encryption.

{{< callout warning >}}
When the installation finishes, do **NOT** select `Restart Device`.
Instead, right-click the `Install Pop!_OS` app in the dock and select `Quit`.
{{< /callout >}}

If you want to understand the structure of the installation, keep reading.
Otherwise, proceed to the next step to perform the second installation.

### [Optional] Understand the default partition layout and installation structure

Open a terminal and examine the default partition layout (alternatively, use GParted):

```fish
lsblk
#> NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
#> loop0         7:0    0   2.5G  1 loop /run/rootfsbase
#> sda           8:0    1  58.6G  0 disk
#> ├─sda1        8:1    1   2.9G  0 part /run/initramfs/live
#> └─sda2        8:2    1     4M  0 part
#> zram0       251:0    0    16G  0 disk [SWAP]
#> nvme0n1     259:0    0 476.9G  0 disk
#> ├─nvme0n1p1 259:1    0     4G  0 part
#> ├─nvme0n1p2 259:2    0     4G  0 part
#> └─nvme0n1p3 259:3    0 468.9G  0 part
```

I have installed Pop!_OS on the 476.9 GB NVMe SSD, recognized as `nvme0n1` on my machine.
Note that the USB flash device shows up as well (`sda`), so we must identify the correct disk carefully.

Let's look closer at the partition layout of `nvme0n1`:

```fish
sudo parted /dev/nvme0n1 unit MiB print
#> Model: SAMSUNG MZVLQ512HBLU-00BH1 (nvme)
#> Disk /dev/nvme0n1: 488386MiB
#> Sector size (logical/physical): 512B/512B
#> Partition Table: gpt
#> Disk Flags:
#>
#> Number  Start    End        Size       File system  Name      Flags
#>  1      2.00MiB  4096MiB    4094MiB    fat32                  boot, esp
#>  2      4096MiB  8192MiB    4096MiB    fat32        recovery  msftdata
#>  3      8192MiB  488384MiB  480192MiB
```

We have the following 3 partitions:

1.  A 4094 MiB FAT32 EFI partition for the systemd bootloader (note the `boot, esp` flag).
2.  A 4096 MiB FAT32 partition for the Pop!_OS recovery system (note the name `recovery`).
3.  A 480192 MiB partition containing the actual system files.

Unlike Pop!_OS 24.04, there is no swap partition anymore; the installer creates a swapfile instead.

Let's open the encrypted `nvme0n1p3` partition and look at what is inside:

```fish
sudo cryptsetup luksOpen /dev/nvme0n1p3 cryptdata
#> Enter passphrase for /dev/nvme0n1p3:
lsblk -f /dev/nvme0n1p3
#> NAME          FSTYPE      FSVER    LABEL UUID                                   FSAVAIL FSUSE% MOUNTPOINTS
#> nvme0n1p3     crypto_LUKS 2              f1403334-28d6-40eb-94d3-3a9931e27d29
#> └─cryptdata   LVM2_member LVM2 001       dVCySv-ny4C-B84W-Dh8F-W5OR-RQEe-1fWcow
#>   └─data-root ext4        1.0            3b52b732-87e5-4a32-92f7-7b8d1bfaedb2
```

The partition is a LUKS2 container (`crypto_LUKS`, version 2).
By default, when installing with encryption, Pop!_OS uses [Logical Volume Management (LVM)](https://askubuntu.com/questions/3596/what-is-lvm-and-what-is-it-used-for): the opened container (`cryptdata`) is a physical volume containing a volume group called `data`.
Inside this volume group, there is a logical volume called `root` (hence the name `data-root`) containing our system files, formatted with ext4.
Since there is no swap partition anymore, `root` takes up the whole volume group.

While I don't use LVM features extensively, the installer requires LVM for encryption, and there is practically no performance downside.

Now that we know the partition layout, let's close everything again: first deactivate the volume group, then close the LUKS container:

```fish
sudo vgchange -an data
#> 0 logical volume(s) in volume group "data" now active
sudo cryptsetup luksClose cryptdata
ls /dev/mapper
#> control
```

We are ready to proceed with the second install, which follows the same steps but uses BTRFS as the underlying filesystem.

## Step 2: Install Pop!_OS using the `Custom (Advanced)` option

Open `Install Pop!_OS` from `Applications` again, and select the region, language, and keyboard layout.
Then choose `Custom (Advanced)`.

You will see your partitioned hard disk (for me, `/dev/nvme0n1`) as shown in the previous step:

*   **First partition:** Click it, activate `Use partition`, activate `Format`, set **Use as** to `Boot /boot/efi`, and **Filesystem** to `fat32`.
*   **Second partition:** Click it, activate `Use partition`, activate `Format`, set **Use as** to `Custom` and enter `/recovery`, set **Filesystem** to `fat32`.
*   **Third (largest) partition:** Click it.
    A `Decrypt This Partition` dialog opens; enter your LUKS password, keep the `Device name` set to `cryptdata` and hit `Decrypt`.
    A new device called `LVM data` will appear at the bottom of the screen (you might need to scroll down).
    Click on this partition, activate `Use partition`, activate `Format`, set **Use as** to `Root (/)`, and **Filesystem** to `btrfs`.

Recheck everything (ensure the correct use of partitions that have a black checkmark) and hit `Erase and Install`.
Follow the steps to create a user account and write changes to the disk.

{{< callout warning >}}
Once the installer finishes, do **NOT** select `Restart Device`, but keep the window open.
{{< /callout >}}

## Step 3: Configure BTRFS subvolumes, swapfile and mount options

Open a terminal[^2] and switch to an interactive root session (all commands in this step run as root in `bash`):

[^2]: You can also run these commands from another computer via SSH.
    In a terminal of the live session, install the SSH server with `sudo apt install -y openssh-server`.
    Then log in from the other computer with `ssh pop-os@192.168.178.51` and the password `pop-os`.
    You get the IP address from your router or with `hostname -I` in the live session.

```fish
sudo -i
```
Maximizing the terminal window helps when working with the command line.

### Mount the BTRFS top-level root filesystem with zstd compression

Open the LUKS container again, activate the volume group and mount the root partition (the top-level BTRFS volume always has id 5) with compression enabled:

```fish
cryptsetup luksOpen /dev/nvme0n1p3 cryptdata
#> Enter passphrase for /dev/nvme0n1p3:
vgchange -ay data # activate every logical volume in the LVM volume group named data
#> 1 logical volume(s) in volume group "data" now active
mount -o subvolid=5,defaults,compress=zstd:1 /dev/mapper/data-root /mnt
ls /mnt
#> bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  recovery  root  run  sbin  srv  swapfile  sys  tmp  usr  var
```

By default, Pop!_OS uses standard BTRFS mount options.
SSDs are detected automatically (`ssd` mount option), and `space_cache=v2` is used (also the [default in Fedora](https://pagure.io/fedora-btrfs/project/issue/24)).
There is some debate about using [`noatime` instead of `relatime`](https://pagure.io/fedora-btrfs/project/issue/9).
With `relatime`, the default, the access time of a file is still written the first time it is read each day.
On BTRFS with snapshots, each of these writes rewrites metadata that would otherwise stay shared with the snapshots; the [BTRFS documentation](https://btrfs.readthedocs.io/en/latest/Administration.html) names this as the worst case for `relatime`.
`noatime` avoids these writes, but programs that rely on access times stop working properly, for example cleanup scripts using `find -atime` or mail clients that detect new mail this way.
As the access time is set per mount point, I combine both: `noatime` for `/`, where the system files are read over and over again (Pop!_OS also mounts ext4 installations with `noatime`), and the default `relatime` for `/home`, so that the access times of my own files stay intact.
In terms of speed, I haven't seen any differences.
One side effect of `noatime` on `/`: `systemd-tmpfiles` then judges the age of files in `/var/tmp` by their modification and change times only.
I also use `compress=zstd:1` (specifically level 1) for SSDs, as recommended by the [Fedora team for workstations](https://fedoraproject.org/wiki/Changes/BtrfsTransparentCompression#Simple_Analysis_of_btrfs_zstd_compression_level).

{{< callout note >}}
**Note on `discard=async`:** Since Linux kernel 6.2, BTRFS [enables `discard=async` by default](https://btrfs.readthedocs.io/en/latest/ch-mount-options.html) on devices that support TRIM.
As we make sure below that TRIM also passes through the LUKS container (`discard` in `/etc/crypttab`), there is no need to add `discard=async` to the mount options.
If you need to disable it for some reason, use the `nodiscard` option.
{{< /callout >}}

### Remove the installer's swapfile

The installer has created a swapfile `/swapfile` at the top level, which does not work on BTRFS (see [What is new](#what-is-new-in-pop_os-2604-for-this-guide)).
Note its size, because we will create a new one of the same size in its own subvolume later; then delete it:

```fish
ls -lh /mnt/swapfile
#> -rw------- 1 root root 25G Nov 26 09:42 /mnt/swapfile
rm /mnt/swapfile
```

The installer uses 40% of the RAM, but at least 4 GiB and at most the size of the root partition minus 20 GiB.

### Create BTRFS subvolumes `@`, `@home` and `@swap`

Instead of moving all files into a new subvolume, create the subvolume `@` as a snapshot of the top level.
This is instant, copies no data and keeps every file attribute exactly as the installer wrote it:

```fish
btrfs subvolume snapshot /mnt /mnt/@
#> Create snapshot of '/mnt' in '/mnt/@'
```

All system files are now in `@` as well, so remove the originals from the top level, i.e. everything except `@`.

{{< callout warning >}}
The `find` command deletes everything at the top level except `@`.
Run it only if `ls /mnt/@` lists the system files, and double-check it before you hit Enter.
{{< /callout >}}

```fish
ls /mnt/@
#> bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  recovery  root  run  sbin  srv  sys  tmp  usr  var
find /mnt -mindepth 1 -maxdepth 1 ! -name @ -exec rm -rf {} +
ls -A /mnt
#> @
```

Next, create the `@home` subvolume and move the user folder from `/mnt/@/home/` into it:

```fish
btrfs subvolume create /mnt/@home
#> Create subvolume '/mnt/@home'
mv /mnt/@/home/* /mnt/@home/
```

Finally, create the `@swap` subvolume, a mount point for it and a new swapfile with the size you noted above (here 25 GiB).
`btrfs filesystem mkswapfile` takes care of the requirements for swapfiles on BTRFS (no copy-on-write, no compression) and formats the file as swap:

```fish
btrfs subvolume create /mnt/@swap
#> Create subvolume '/mnt/@swap'
mkdir /mnt/@/swap
btrfs filesystem mkswapfile --size 25g /mnt/@swap/swapfile
#> create swapfile /mnt/@swap/swapfile size 25.00GiB (26843545600)
```

Verify that everything is in place:
```fish
ls -a /mnt/@/home
#> . ..
ls -a /mnt/@home
#> . .. wmutschl
ls -a /mnt/@swap
#> . .. swapfile
btrfs subvolume list /mnt
#> ID 256 gen 19 top level 5 path @
#> ID 257 gen 19 top level 5 path @home
#> ID 258 gen 19 top level 5 path @swap
```

### [Optional] Compress the existing files

A snapshot shares the data of the original, so the files the installer wrote are still uncompressed; only files written from now on are compressed.
To compress the existing system files as well, defragment them with compression (this takes a minute or two):

```fish
btrfs filesystem defragment -r -czstd /mnt/@
```

### Changes to fstab

We need to update `/etc/fstab` to:

*   Mount `/` to the `@` subvolume with compression and `noatime`.
*   Mount `/home` to the `@home` subvolume with compression, keeping the default `relatime`.
*   Mount `/swap` to the `@swap` subvolume.
*   Use the new swapfile `/swap/swapfile` instead of `/swapfile`.

Have a look at the `fstab` the installer has written:

```fish
cat /mnt/@/etc/fstab
#> # <file system>  <mount point>  <type>  <options>  <dump>  <pass>
#> PARTUUID=57649885-cdfa-4ee6-ae5f-fee41f953423  /boot/efi  vfat  umask=0077  0  0
#> PARTUUID=e80a8de3-b647-4e1d-b5a7-b60364d429bd  /recovery  vfat  umask=0077  0  0
#> UUID=a1b4a57c-e021-444e-8942-01baa8ea198c  /  btrfs  defaults  0  1
#> /swapfile  none  swap  sw,pri=10  0  0
```

Edit it with a text editor (e.g., `nano /mnt/@/etc/fstab`) or use these commands, which delete the installer's lines for `/` and `/swapfile` and append the new ones:

```sh
ROOTUUID=$(blkid -s UUID -o value /dev/mapper/data-root)
sed -i -E '\|^UUID=\S+\s+/\s+btrfs\s|d; \|^/swapfile\s|d' /mnt/@/etc/fstab
cat >> /mnt/@/etc/fstab <<EOF
UUID=$ROOTUUID  /  btrfs  defaults,noatime,compress=zstd:1,subvol=@  0  0
UUID=$ROOTUUID  /home  btrfs  defaults,compress=zstd:1,subvol=@home  0  0
UUID=$ROOTUUID  /swap  btrfs  defaults,subvol=@swap  0  0
/swap/swapfile  none  swap  sw,pri=10  0  0
EOF
```

Your `fstab` should end like this (your UUIDs will be different):

```fish
cat /mnt/@/etc/fstab
#> PARTUUID=57649885-cdfa-4ee6-ae5f-fee41f953423  /boot/efi  vfat  umask=0077  0  0
#> PARTUUID=e80a8de3-b647-4e1d-b5a7-b60364d429bd  /recovery  vfat  umask=0077  0  0
#> UUID=a1b4a57c-e021-444e-8942-01baa8ea198c  /  btrfs  defaults,noatime,compress=zstd:1,subvol=@  0  0
#> UUID=a1b4a57c-e021-444e-8942-01baa8ea198c  /home  btrfs  defaults,compress=zstd:1,subvol=@home  0  0
#> UUID=a1b4a57c-e021-444e-8942-01baa8ea198c  /swap  btrfs  defaults,subvol=@swap  0  0
#> /swap/swapfile  none  swap  sw,pri=10  0  0
```

The `subvol=@` for `/` must match the kernel option `rootflags=subvol=@`, which we add below; at boot, the kernel option decides which subvolume is mounted as `/`.

### Changes to crypttab

The entry for `cryptdata` in `/etc/crypttab` needs the option `discard`, so that TRIM commands reach the SSD through the encryption.
The installer only writes it since [23 November 2026](https://github.com/pop-os/distinst/pull/358); older ISOs write plain `luks`.
This command adds `discard` if it is missing and does nothing otherwise:

```fish
sed -i 's/ luks$/ luks,discard/' /mnt/@/etc/crypttab
cat /mnt/@/etc/crypttab
#> cryptdata UUID=f1403334-28d6-40eb-94d3-3a9931e27d29 none luks,discard
```

The installer's `/etc/dracut.conf.d/luks.conf` copies the crypttab into the initial RAM disk, which we regenerate below.

{{< callout note >}}
**Note on `discard` in crypttab:** The trade-off: an attacker with access to the raw disk can see which blocks are unused, which leaks some metadata (e.g., the filesystem type and how full it is), but not the content.
Pop!_OS 24.04 did not enable it.
If you prefer that, skip the `sed` command and remove `,discard` from the `cryptdata` line instead.
{{< /callout >}}

### Create a chroot environment

To work inside the newly installed OS without booting into it, create a chroot environment.[^3]
Unmount the top-level root filesystem (id 5) and mount the subvolume `@` to `/mnt` instead:

[^3]: Think of a chroot as stepping into the installed system without booting it.
    `chroot /mnt` ("change root") starts a shell in which `/mnt` becomes `/`, so every command sees the files of the installed system and uses its programs and configuration: `apt`, `kernelstub` and `update-initramfs` then change the installed system instead of the live session.
    The running kernel, the hardware and the network still come from the live session; that is why we first make its `/dev`, `/proc`, `/sys` (including the EFI variables) and `/run` available inside `/mnt`.
    `exit` leaves the chroot and takes you back to the live session.

```fish
umount /mnt
mount -o subvol=@,defaults,compress=zstd:1 /dev/mapper/data-root /mnt
ls /mnt
#> bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  recovery  root  run  sbin  srv  swap  sys  tmp  usr  var
```

The second installation has just reformatted the EFI and recovery partitions, so their UUIDs have changed.
Refresh the live session's view of the disks, otherwise the initial RAM disk we build below may wait forever for a UUID that no longer exists:

```fish
udevadm trigger --settle
```

Mount the necessary system directories and enter the chroot (based on System76's [Repair the Bootloader](https://support.system76.com/articles/bootloader/#systemd-boot) guide).[^4]

[^4]: The bind mounts give the chroot the live session's view of the machine instead of empty directories from the installed system.
    `/dev` holds the device nodes (disks, mappers, terminals); `/dev/pts` holds the pseudo-terminals that interactive shells and SSH sessions use.
    `/proc` exposes process and kernel state; `/sys` exposes devices, drivers and firmware interfaces; `/run` holds runtime data such as udev and the locks that `cryptsetup` and LVM need.
    `/sys/firmware/efi/efivars` needs a mount of its own; without it, kernelstub cannot read the firmware's boot entries and prints `Failed to retrieve NVRAM data. Are you running in a chroot?` with a traceback (it still does its job, though).

```sh
for i in /dev /dev/pts /proc /sys /sys/firmware/efi/efivars /run; do mount -B $i /mnt$i; done
chroot /mnt
```

Now inside the new system, mount everything in `fstab`; this also checks the file for mistakes:

```fish
mount -av
#> mount: (hint) your fstab has been modified, but systemd still uses
#>        the old version; use 'systemctl daemon-reload' to reload.
#> /boot/efi                : successfully mounted
#> /recovery                : successfully mounted
#> /                        : ignored
#> /home                    : successfully mounted
#> /swap                    : successfully mounted
#> none                     : ignored
```

If one of the lines reports an error, fix `/etc/fstab` before you continue.
A hint that systemd still uses an old version of your fstab refers to the live session and can be ignored.

### Check btrfs-progs, adjust kernelstub and regenerate the initial RAM disk

*dracut* only adds its BTRFS support to the initial RAM disk if the `btrfs` command is available.
The installer keeps the BTRFS tools when it formats a partition with BTRFS, so `apt` should report that `btrfs-progs` is already installed; if not, it installs the package:

```fish
apt install -y btrfs-progs
#> btrfs-progs is already the newest version (6.17.1-1build1).
```

Pop!_OS uses `kernelstub` to copy the kernel and the initial RAM disk to the EFI partition and to write the entry for the systemd bootloader.
Add `rootflags=subvol=@` to its kernel options, so that the root filesystem is mounted from the `@` subvolume.
`kernelstub -a` stores the option in `/etc/kernelstub/configuration`, so it persists across kernel updates, and updates the bootloader entry right away:

```fish
kernelstub -a "rootflags=subvol=@"
```

Then regenerate the initial RAM disk for all kernels.
Ubuntu's dracut builds a host-only initial RAM disk: because `/boot/efi` is mounted, it adds a wait for that partition's UUID.
That is why `udevadm trigger --settle` above matters; without it, the wait can point at the UUID from the Clean Install, and the first boot hangs after unlocking LUKS with `still waiting for following initqueue hooks` and a `devexists-…C281-0025.sh` (or similar) script.
Ubuntu's dracut package comes with its own `update-initramfs`, which runs `kernelstub` again afterwards, so the new initial RAM disk is copied to the EFI partition (calling `dracut` directly would skip that):

```fish
update-initramfs -c -k all
#> update-initramfs: Generating /boot/initrd.img-7.2.15-76070215-generic
#> Updating kernel version 7.2.15-76070215-generic in systemd-boot...
#> Sign command: /usr/bin/kmodsign
#> Signing key: /var/lib/shim-signed/mok/MOK.priv
#> Public certificate (MOK): /var/lib/shim-signed/mok/MOK.der
#>
#> Autoinstall of module system76_acpi/1.0.2~1788189231~26.04~20cc5e3 for kernel 7.2.15-76070215-generic (x86_64)
#> Warning: The /var/lib/dkms/system76_acpi/1.0.2~1788189231~26.04~20cc5e3/7.2.15-76070215-generic/x86_64/dkms.conf
#> for module system76_acpi/1.0.2~1788189231~26.04~20cc5e3 includes a BUILD_EXCLUSIVE directive
#> which does not match this kernel/arch/config.
#> This indicates that it should not be built.
#>
#> Autoinstall on 7.2.15-76070215-generic succeeded for module(s) system76-io system76.
#> Autoinstall on 7.2.15-76070215-generic was skipped for module(s) system76_acpi.
#> kernelstub.Config    : INFO     Looking for configuration...
#> kernelstub           : INFO     System information:
#>
#>     OS:..................Pop!_OS 26.04
#>     Root partition:....../dev/dm-1
#>     Root FS UUID:........a1b4a57c-e021-444e-8942-01baa8ea198c
#>     ESP Path:............/boot/efi
#>     ESP Partition:......./dev/nvme0n1p1
#>     ESP Partition #:.....1
#>     NVRAM entry #:.......-1
#>     Boot Variable #:.....0000
#>     Kernel Boot Options:.quiet loglevel=0 systemd.show_status=false splash threadirqs rd.luks.uuid=f1403334-28d6-40eb-94d3-3a9931e27d29 rootflags=subvol=@
#>     Kernel Image Path:.../boot/vmlinuz-7.2.15-76070215-generic
#>     Initrd Image Path:.../boot/initrd.img-7.2.15-76070215-generic
#>     Force-overwrite:.....False
#>
#> kernelstub.Installer : INFO     Copying Kernel into ESP
#> kernelstub.Installer : INFO     Copying initrd.img into ESP
#> kernelstub.Installer : INFO     Setting up loader.conf configuration
#> kernelstub.Installer : INFO     Making entry file for Pop!_OS
#> kernelstub.Installer : INFO     Backing up old kernel
#> kernelstub.Installer : INFO     No old kernel found, skipping
```

Check the result:

```fish
cat /boot/efi/loader/entries/Pop_OS-current.conf
#> title Pop!_OS
#> linux /EFI/Pop_OS-a1b4a57c-e021-444e-8942-01baa8ea198c/vmlinuz.efi
#> initrd /EFI/Pop_OS-a1b4a57c-e021-444e-8942-01baa8ea198c/initrd.img
#> options root=UUID=a1b4a57c-e021-444e-8942-01baa8ea198c ro quiet loglevel=0 systemd.show_status=false splash threadirqs rd.luks.uuid=f1403334-28d6-40eb-94d3-3a9931e27d29 rootflags=subvol=@
lsinitrd -m /boot/initrd.img | grep -E '^(btrfs|crypt|lvm)$'
#> btrfs
#> crypt
#> lvm
lsinitrd -f /etc/crypttab /boot/initrd.img
#> cryptdata /dev/disk/by-uuid/f1403334-28d6-40eb-94d3-3a9931e27d29 none luks,discard
EFIUUID=$(blkid -s UUID -o value /dev/nvme0n1p1)
echo $EFIUUID
#> ED6A-F65C
lsinitrd /boot/initrd.img | grep -F "$EFIUUID"
#> -rw-r--r--   1 root     root           92 Nov 26 13:45 var/lib/dracut/hooks/emergency/80-\x2fdev\x2fdisk\x2fby-uuid\x2fED6A-F65C.sh
#> -rw-r--r--   1 root     root           37 Nov 26 13:45 var/lib/dracut/hooks/initqueue/finished/devexists-\x2fdev\x2fdisk\x2fby-uuid\x2fED6A-F65C.sh
```

The bootloader entry must contain `rootflags=subvol=@` (with the NVIDIA driver, you will also see `nvidia-drm.modeset=1`), the initial RAM disk must contain the dracut modules `btrfs`, `crypt` and `lvm`, and its copy of the crypttab must match `/etc/crypttab`.
`grep -F "$EFIUUID"` must find the `devexists` script; if it prints nothing, the initial RAM disk still waits for an old UUID: leave the chroot, run `udevadm trigger --settle` again, enter the chroot, mount `/boot/efi` and regenerate the initial RAM disk.

{{< callout note >}}
On Pop!_OS 24.04, this guide edited `/etc/kernelstub/configuration` and the bootloader entry by hand.
`kernelstub -a` does both and avoids the classic mistake of a missing comma in the JSON file.
{{< /callout >}}

### [Optional] Show the boot menu

Optionally, add a timeout to the systemd boot menu to easily access the recovery system (kernelstub keeps this line when it updates the bootloader; it only rewrites `loader.conf` when it runs with `--force-update`):

```fish
echo "timeout 3" >> /boot/efi/loader/loader.conf
cat /boot/efi/loader/loader.conf
#> default Pop_OS-current
#> timeout 3
```

Without a timeout, you can still open the menu by pressing the space bar repeatedly while the computer starts.

Exit the chroot:

```fish
exit
```

## Step 4: Reboot, some checks, and system updates

Close the terminal and click `Restart Device` in the installer app.
Crossing fingers!
If all goes well, you will see a passphrase prompt.
Enter your LUKS passphrase, and your system should boot.

{{< callout note >}}
If instead it hangs after unlocking LUKS with `still waiting for following initqueue hooks` and a short FAT UUID in a `devexists-…` script, the initial RAM disk was built against a stale EFI UUID: boot the recovery system, refresh udev, remount, and regenerate the initial RAM disk as in Step 3.
{{< /callout >}}

After the welcome screen, go to the settings and:

*   **Network & wireless**: check your connection, for example deactivate unused interfaces and add IP configuration to used interface or add Wifi password.
*   **Power & battery**: choose the power profile and check the power saving options (on a server I deactivate them, on a notebook I keep them).

Next, we verify the setup in a terminal:

```fish
sudo mount -av
#> /boot/efi                : already mounted
#> /recovery                : already mounted
#> /                        : ignored
#> /home                    : already mounted
#> /swap                    : already mounted
#> none                     : ignored
cat /proc/cmdline
#> initrd=\EFI\Pop_OS-a1b4a57c-e021-444e-8942-01baa8ea198c\initrd.img root=UUID=a1b4a57c-e021-444e-8942-01baa8ea198c ro quiet loglevel=0 systemd.show_status=false splash threadirqs rd.luks.uuid=f1403334-28d6-40eb-94d3-3a9931e27d29 rootflags=subvol=@
```

Check that the optimized mount options are active.
BTRFS-specific options such as `compress` apply to the whole filesystem, which is why `/swap` shows them too, whereas the access time options are set per mount point: `noatime` for `/`, the default `relatime` for `/home` and `/swap`.
`discard=async` only appears if TRIM passes through the LUKS container:

```fish
sudo mount -v | grep /dev/mapper
#> /dev/mapper/data-root on / type btrfs (rw,noatime,compress=zstd:1,ssd,discard=async,space_cache=v2,subvolid=256,subvol=/@)
#> /dev/mapper/data-root on /home type btrfs (rw,relatime,compress=zstd:1,ssd,discard=async,space_cache=v2,subvolid=257,subvol=/@home)
#> /dev/mapper/data-root on /swap type btrfs (rw,relatime,compress=zstd:1,ssd,discard=async,space_cache=v2,subvolid=258,subvol=/@swap)
```

### Swap

Check that both the zram device and the swapfile are active:

```fish
sudo swapon
#> NAME           TYPE      SIZE USED PRIO
#> /swap/swapfile file       25G   0B   10
#> /dev/zram0     partition  16G   0B 1000
```

Pop!_OS uses **two swap mechanisms**:

1. **zram** (compressed swap in RAM): its high priority (1000) means it is used first and provides fast swap for everyday use.
2. **The swapfile**: lives inside the encrypted partition and is used with lower priority (10) when zram is full.

{{< callout note >}}
**About hibernation:** Pop!_OS does not configure hibernation (suspend-to-disk) by default.
The swapfile is encrypted with your LUKS key, so it would survive a reboot, unlike the swap partition of Pop!_OS 24.04 with its random key.
But on BTRFS the kernel also needs the offset of the swapfile (`btrfs inspect-internal map-swapfile -r /swap/swapfile`) as `resume_offset`, the swapfile must be at least as large as the RAM you use, and hibernating writes that much to the SSD every time.
Setting this up is beyond the scope of this guide; see System76's article on [hibernation](https://support.system76.com/articles/enable-hibernation/).
{{< /callout >}}

### BTRFS and TRIM

Inspect the BTRFS filesystem and its subvolumes:

```fish
sudo btrfs filesystem show /
#> Label: none  uuid: a1b4a57c-e021-444e-8942-01baa8ea198c
#>         Total devices 1 FS bytes used 53.52GiB
#>         devid    1 size 468.92GiB used 62.02GiB path /dev/mapper/data-root
sudo btrfs subvolume list /
#> ID 256 gen 61 top level 5 path @
#> ID 257 gen 56 top level 5 path @home
#> ID 258 gen 41 top level 5 path @swap
```

On an SSD or NVMe drive, TRIM tells the drive which blocks are free.
It only reaches the drive if every layer passes it on; check that the LUKS container and the logical volume support it (the columns `DISC-GRAN` and `DISC-MAX` must not be `0B`, unless you have left out `discard` in `/etc/crypttab` on purpose):

```fish
lsblk --discard /dev/nvme0n1
#> NAME            DISC-ALN DISC-GRAN DISC-MAX DISC-ZERO
#> nvme0n1                0      4.9M       2T         0
#> ├─nvme0n1p1      3014656      4.9M       2T         0
#> ├─nvme0n1p2      4063232      4.9M       2T         0
#> └─nvme0n1p3      3014656      4.9M       2T         0
#>   └─cryptdata          0      4.9M       2T         0
#>     └─data-root        0      4.9M       2T         0
```

Besides `discard=async`, a weekly `fstrim.timer` trims all filesystems; make sure it is enabled:

```fish
systemctl is-enabled fstrim.timer
#> enabled
```

If it is not, enable it with `sudo systemctl enable --now fstrim.timer`.

### System updates

Finally, update the system including the recovery partition and flatpak applications:

```fish
sudo apt update
sudo apt -y full-upgrade
sudo apt -y autoremove --purge
sudo apt -y autoclean
pop-upgrade recovery upgrade from-release
flatpak update
```

I also recommend updating firmware:

```fish
sudo fwupdmgr get-devices
sudo fwupdmgr get-updates
sudo fwupdmgr update
```

Reboot once more:

```fish
sudo reboot
```

## Step 5: Snapshot tools

With BTRFS set up with `@` and `@home` subvolumes, you can now use various snapshot and backup tools:

* **[Timeshift](https://github.com/linuxmint/timeshift):** A popular GUI tool for system snapshots.
  Note that Timeshift **requires** the `@` and `@home` subvolume naming convention we set up in this guide.
* **[BTRBK](https://github.com/digint/btrbk):** A powerful tool for snapshot management and backup with support for incremental send/receive to remote locations.
  Personally, I prefer BTRBK for its flexibility and send/receive capabilities.
* **[Snapper](https://github.com/openSUSE/snapper):** Another snapshot management tool, popular in openSUSE.

Whatever you use, leave `@swap` out: BTRFS cannot snapshot a subvolume with an active swapfile, and there is nothing in it worth keeping.

We will now focus only on Timeshift as it is (in my opinion) the most *user-friendly* one.

### Install and configure Timeshift
Install [Timeshift](https://github.com/linuxmint/timeshift) (it brings `cron`, which runs its scheduled snapshots) and configure it via the GUI:

```fish
sudo apt update
sudo apt install -y timeshift
```
Go to `Applications` and search for `Timeshift`.

<!-- TEST: walk through the Timeshift 25.12 wizard; are the option names and the "does not have BTRFS partition" warning still accurate? -->

*   Select **BTRFS** as the **Snapshot Type**; click **Next**.
*   Select your BTRFS system partition as the **Snapshot Location**; click **Next**.
    If Timeshift warns "Selected device does not have BTRFS partition", ignore it; this is a bug with encrypted devices.
*   **Select Snapshot Levels** (my recommendations):
    *   Activate **Monthly** and set to 2.
    *   Activate **Weekly** and set to 3.
    *   Activate **Daily** and set to 5.
    *   Deactivate **Hourly**.
    *   Activate **Boot** and set to 5.
    *   Activate **Stop cron emails for scheduled tasks**.
    *   Click **Next**.
*   **User Home Directories**: Include the `@home` subvolume (not selected by default).
    While you usually restore only `@`, having home snapshots is convenient.
*   Click **Finish**.
*   Create a manual snapshot named "Clean Install" (double click in the *Comments* column) and exit Timeshift.

Timeshift will now manage snapshots automatically.

### Verify snapshots

In a terminal, you can verify the snapshots:

```fish
sudo btrfs subvolume list /
#> ID 256 gen 98 top level 5 path @
#> ID 257 gen 96 top level 5 path @home
#> ID 258 gen 41 top level 5 path @swap
#> ID 259 gen 98 top level 5 path timeshift-btrfs/snapshots/2026-11-26_14-16-35/@
#> ID 260 gen 97 top level 5 path timeshift-btrfs/snapshots/2026-11-26_14-16-35/@home
```

## Step 6: Practice recovery and system rollback

Let's simulate a system failure to practice recovery.
We have snapshots to roll back to (in the subvolumes at the top level).

**Delete the `/etc` folder (simulating disaster) and restart:**

```fish
sudo sh -c 'rm -rf /etc; reboot'
```

Both happen in one command, because `sudo` stops working once `/etc/sudoers` is gone.
The system will not boot properly anymore, so boot into the `Pop!_OS recovery` entry of the systemd bootloader instead (this is why I set the timeout to 3 seconds).

I will show you two ways to roll back: with Timeshift and manually.
Both end with the same step, [refreshing the boot files](#refresh-the-boot-files).
For both, open a terminal in the recovery system and unlock the encrypted partition:

```fish
sudo -i
cryptsetup luksOpen /dev/nvme0n1p3 cryptdata
#> Enter passphrase for /dev/nvme0n1p3:
vgchange -ay data # activate every logical volume in the LVM volume group named data
#> 1 logical volume(s) in volume group "data" now active
```

### Rollback with Timeshift
1.  Install Timeshift in the recovery system:
    ```fish
    apt update
    apt install -y timeshift
    ```
2.  Go to `Applications` and open Timeshift.
3.  Select **BTRFS**, and choose your disk.
    If Timeshift warns "Selected device does not have BTRFS partition", ignore it; this is a bug with encrypted devices.
4.  Select a snapshot and click **Restore**.
    Restore only `@`, unless you also want to roll back your home directories.
5.  Timeshift will restore the system subvolume.
    Close Timeshift without rebooting and continue with [Refresh the boot files](#refresh-the-boot-files).

### Rollback manually
1.  Mount the top-level root filesystem:
    ```fish
    mount -o subvolid=5 /dev/mapper/data-root /mnt
    ls /mnt
    #> @  @home  @swap  timeshift-btrfs
    ```
2.  Move the broken subvolume out of the way:
    ```fish
    mv /mnt/@ /mnt/@.broken
    ```
3.  Find a valid snapshot in `timeshift-btrfs/snapshots/`:
    ```fish
    ls /mnt/timeshift-btrfs/snapshots
    #> 2026-11-26_13-30-04
    ```
4.  Create a snapshot of the good subvolume as the new `@`.
    A snapshot instead of `mv` leaves the Timeshift snapshot intact:
    ```fish
    btrfs subvolume snapshot /mnt/timeshift-btrfs/snapshots/2026-11-25_10-37-12/@ /mnt/@
    #> Create snapshot of '/mnt/timeshift-btrfs/snapshots/2026-11-25_10-37-12/@'  in '/mnt/@'
    ```
5.  Unmount the top-level root filesystem and continue with [Refresh the boot files](#refresh-the-boot-files):
    ```fish
    umount /mnt
    ```

### Refresh the boot files

Unlike with GRUB, the kernel and the initial RAM disk that systemd-boot starts live on the EFI partition, outside of any snapshot.
If the snapshot is older than the last kernel update, the kernel on the EFI partition is newer than the modules in the restored `@`, and the system boots without them (no network, no graphics) or not at all.
So after every rollback, let kernelstub copy the kernel and the initial RAM disk of the restored snapshot to the EFI partition (if they have not changed, this does no harm), then reboot:

```sh
mount -o subvol=@ /dev/mapper/data-root /mnt
for i in /dev /dev/pts /proc /sys /sys/firmware/efi/efivars /run; do mount -B $i /mnt$i; done
chroot /mnt sh -c 'mount /boot/efi && kernelstub -v'
reboot
```

There is no need to regenerate the initial RAM disk: `/boot` is part of `@`, so the restored snapshot brings a kernel and an initial RAM disk that match its modules, and kernelstub copies the newest of them.
kernelstub also keeps the previous kernel as a second entry in the boot menu (`Pop_OS-oldkern`).

After a **manual rollback**, delete the broken subvolume once you are back in your system to save space.
It lives at the top level, so mount that first:
```fish
sudo mount -o subvolid=5 /dev/mapper/data-root /mnt
sudo btrfs subvolume delete /mnt/@.broken
#> Delete subvolume 256 (no-commit): '/mnt/@.broken'
sudo umount /mnt
```

**FINISHED! CONGRATULATIONS!**

**Check out my [Pop!_OS post-installation steps](../pop-os-post-install).**
