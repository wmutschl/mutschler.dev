---
title: 'Debian Trixie (13): Things to do after installation (Apps, Settings, and Tweaks)'
summary: In the following I will go through my post installation steps on Debian Trixie, i.e. system configuration, remote access setup, security hardening, and various optimizations.
header:
  image: "linuxhacker.jpg"
  caption: ""
tags: ["linux", "debian", "install guide", "post-install"]
date: 2025-12-09
type: book
---

***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev). Pull requests are very much appreciated.***

<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

This guide walks through my post-installation steps on Debian Trixie. I use this machine primarily as a server, but still need a desktop environment for certain tasks (either MATE or GNOME). The guide covers system configuration, remote access setup, security hardening, and various optimizations.

{{< callout warning >}}
Unless otherwise indicated, ALL COMMANDS in this guide should be run as ROOT. Become root by running `su -` in your terminal!
{{< /callout >}}

{{< toc hide_on="xl" >}}

## Initial System Setup

### Add user to sudoers (optional)

This is typically the first thing people want to do after installation, so I'll cover it here—even though I personally don't use sudo on Debian and prefer to run commands as root directly via `su -`.

If you want to use sudo, add your user to the sudo group:

```fish
# Run as root (su -)
/sbin/usermod -aG sudo wmutschl
```

Replace `wmutschl` with your actual username. Log out and back in (or reboot) for the change to take effect.

### Enable contrib and non-free repositories

Debian separates packages based on their licenses. To access proprietary drivers, codecs, and other non-free software, enable the `contrib` and `non-free` repositories:

```fish
nano /etc/apt/sources.list
```

Ensure the file contains the following:

```
deb http://deb.debian.org/debian/ trixie main contrib non-free non-free-firmware
deb-src http://deb.debian.org/debian/ trixie main contrib non-free non-free-firmware

deb http://security.debian.org/debian-security trixie-security main contrib non-free non-free-firmware
deb-src http://security.debian.org/debian-security trixie-security main contrib non-free non-free-firmware

deb http://deb.debian.org/debian/ trixie-updates main contrib non-free non-free-firmware
deb-src http://deb.debian.org/debian/ trixie-updates main contrib non-free non-free-firmware
```

Then update the package list:

```fish
apt update
```

### Install firmware

Debian Trixie includes most firmware in the `non-free-firmware` repository. After enabling it above, install any missing firmware:

```fish
apt install firmware-linux firmware-linux-nonfree
```


## Hardware Configuration

### Install NVIDIA drivers

If you have an NVIDIA GPU, the proprietary drivers provide significantly better performance than the open-source nouveau drivers.

First, install the detection tool:

```fish
apt install nvidia-detect
```

Run it to identify your GPU and the recommended driver:

```fish
nvidia-detect
# Detected NVIDIA GPUs:
# 42:00.0 VGA compatible controller [0300]: NVIDIA Corporation GP107GL [Quadro P620] [10de:1cb6] (rev a1)
#
# Checking card:  NVIDIA Corporation GP107GL [Quadro P620] (rev a1)
# Your card is supported by all driver versions.
# Your card is also supported by the Tesla 535 drivers series.
# It is recommended to install the
#     nvidia-driver
# package.
```

Install the kernel headers and the recommended driver:

```fish
apt install linux-headers-amd64
apt install nvidia-driver
```

Reboot to apply the changes.


### Fix IO_PAGE_FAULT errors (AMD systems)

On AMD systems with IOMMU, you may encounter IO_PAGE_FAULT errors in the kernel log:

```fish
dmesg --level=emerg,err,warn
# [  812.086690] ahci 0000:02:00.0: AMD-Vi: Event logged [IO_PAGE_FAULT domain=0x0043 address=0xecdd5004 flags=0x0070]
```

This [video](https://www.youtube.com/watch?v=wJN3e8Usmzw) explains the problem and solution. To fix it, add kernel parameters to GRUB:

```fish
nano /etc/default/grub
```

Find the line `GRUB_CMDLINE_LINUX_DEFAULT` and add the parameters:

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet amd_iommu=on iommu=pt"
```

Update GRUB and reboot:

```fish
update-grub
reboot
```

### Enable TRIM for SSDs

If you have an SSD or NVMe drive, enabling TRIM helps maintain performance over time. Check if the [fstrim timer is enabled](https://askmeaboutlinux.com/2021/05/05/theres-something-about-trim-in-linuxmint-or-ubuntu-linux/):

```fish
systemctl status fstrim.timer
```

If not enabled, enable and start it:

```fish
systemctl enable fstrim.timer
systemctl start fstrim.timer
```

You can also run TRIM manually:

```fish
fstrim -av
# /btrfs_docker: 607.6 GiB (652451688448 bytes) trimmed on /dev/mapper/crypt_docker
# /boot/efi: 965.3 MiB (1012170752 bytes) trimmed on /dev/sdc1
# /boot: 779.4 MiB (817225728 bytes) trimmed on /dev/sdc2
# /var/lib/docker: 80 GiB (85931634688 bytes) trimmed on /dev/nvme0n1p2
# /: 104.7 GiB (112431742976 bytes) trimmed on /dev/mapper/debian--vg-root
```

### Enable zram for compressed swap in RAM

zram creates compressed swap space in RAM, which is faster than disk-based swap and reduces SSD wear. This is especially beneficial on systems with ample RAM.

```fish
apt install zram-tools
systemctl enable --now zramswap
```

To customize size and compression algorithm:

```fish
nano /etc/default/zramswap
```

I usually leave the defaults. After changes, restart the service:

```fish
systemctl restart zramswap
```

Verify zram is active:

```fish
zramctl
# or
swapon --show
```


## Remote Access

### Install and configure OpenSSH Server

Since I access this machine primarily via SSH, this is one of the first services I set up:

```fish
apt install -y openssh-server
```

Configure SSH settings:

```fish
nano /etc/ssh/sshd_config
```

Add or modify the following at the bottom of the file:

```
PermitRootLogin yes
PasswordAuthentication no
X11Forwarding yes
```

Enable and start the SSH service:

```fish
systemctl enable ssh
systemctl start ssh
```

#### Generate or restore SSH keys

To create a new SSH key:

```fish
# Run as your normal user, not root
ssh-keygen -t ed25519 -C "debian"
```

Usually, I restore my `.ssh` folder from backup instead. Either way, add your key to the ssh-agent:

```fish
# Run as your normal user, not root
eval "$(ssh-agent -s)"  # for bash
eval (ssh-agent -c)     # for fish
ssh-add ~/.ssh/id_ed25519
```

Don't forget to add your public key to GitHub, GitLab, servers, etc.

#### Configure authorized keys for incoming connections

```fish
# Run as your normal user, not root
nano ~/.ssh/authorized_keys
# Add your public keys, one per line:
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJID7JVno+R8RzuCYQAV66VnZOgpuwNpQnzFiiX3tT6Q MacBook
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFSlhZlx/+KMV9LG6v8W55UAkc+aOvS8W9r1oVRH+yYq Mac Mini
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDl5yCXr9igpwWlV5cUC9yBOdcabNktlSpjqhCQpI+rZ iPad
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGVN/LM0sCk4sacciihBlycWHqtQUpm4KCCvBl5IdlAm iPhone

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chown -R $USER:$USER ~/.ssh
```

### Install and configure Tailscale

I use [Tailscale](https://tailscale.com/kb/1626/install-debian-trixie) on all my systems to connect them via WireGuard from anywhere. Installation is straightforward:

```fish
curl -fsSL https://pkgs.tailscale.com/stable/debian/trixie.noarmor.gpg | tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null
curl -fsSL https://pkgs.tailscale.com/stable/debian/trixie.tailscale-keyring.list | tee /etc/apt/sources.list.d/tailscale.list

curl -fsSL https://tailscale.com/install.sh | sh
```

Connect your machine to your Tailscale network:

```fish
tailscale up
# To authenticate, visit:
# https://login.tailscale.com/a/SOMETHING
```

I also disable key expiry in the Tailscale admin console to prevent periodic re-authentication.

Check your Tailscale IP:

```fish
tailscale ip -4
```

#### Configure as exit node

I use this machine as an [exit node](https://tailscale.com/kb/1103/exit-nodes):

```fish
echo 'net.ipv4.ip_forward = 1' | tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | tee -a /etc/sysctl.d/99-tailscale.conf
sysctl -p /etc/sysctl.d/99-tailscale.conf
tailscale up --advertise-exit-node
```

Then enable the exit node in your Tailscale admin console.

#### Fix UDP GRO forwarding for better throughput

When running as an exit node or subnet router, Tailscale may warn about suboptimal UDP GRO forwarding. This [optimization](https://tailscale.com/s/ethtool-config-udp-gro) improves UDP throughput on Linux 6.2+ kernels.

Since Debian Trixie doesn't have `networkd-dispatcher`, create a systemd service to apply the setting persistently:

```fish
cat << 'EOF' | tee /etc/systemd/system/tailscale-udp-offload.service
[Unit]
Description=Configure UDP GRO forwarding for Tailscale
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/bin/sh -c 'ethtool -K $(ip -o route get 8.8.8.8 | cut -f 5 -d " ") rx-udp-gro-forwarding on rx-gro-list off'
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now tailscale-udp-offload.service
```

Verify it's working:

```fish
systemctl status tailscale-udp-offload.service
```

### Install NoMachine for remote desktop

NoMachine provides excellent remote desktop access. You may need to adjust the version and URL:

```fish
cd /tmp
curl -O https://web9001.nomachine.com/download/9.2/Linux/nomachine_9.2.18_3_amd64.deb
apt install ./nomachine_9.2.18_3_amd64.deb
```

Launch NoMachine and configure it. I enable "always run" mode.

To troubleshoot connection issues, restart the NoMachine server:

```fish
/usr/NX/bin/nxserver --restart
```

**Note:** As of December 2025, NoMachine doesn't work well with Wayland!


## Security Hardening

### Lock down server with UFW (allow only Tailscale)

{{< callout note >}}
Before locking down the server, exit your current SSH session and reconnect using the Tailscale IP to ensure you won't lose access:

```
ssh username@100.x.y.z
ssh username@debian  # if using Magic DNS with hostname "debian"
```
{{< /callout >}}

Since I access this machine primarily over Tailscale, I [lock it down using UFW](https://tailscale.com/kb/1077/secure-server-ubuntu) to only accept connections from the Tailscale interface:

```fish
apt install -y ufw
ufw enable
ufw default deny incoming
ufw default allow outgoing
ufw allow in on tailscale0
```

Check the status:

```fish
ufw status verbose
# Status: active
# Logging: on (low)
# Default: deny (incoming), allow (outgoing), deny (routed)
# New profiles: skip
#
# To                         Action      From
# --                         ------      ----
# Anywhere on tailscale0     ALLOW IN    Anywhere
# Anywhere (v6) on tailscale0 ALLOW IN    Anywhere (v6)
```

If you previously had SSH open on port 22 from the public internet, you can remove it:

{{< callout warning >}}
Ensure you can SSH via Tailscale before completing this step, otherwise you may lose access to your server!
{{< /callout >}}

```fish
ufw delete allow 22/tcp
ufw reload
systemctl restart ssh
```


## Storage Configuration

### Reconnect additional encrypted disks

My setup includes these disks:
- 119.2 GB SSD for the system (sdc system disk)
- 1.6 TB SSD partition for docker files (nvme0n1p4)
- 3.6 TB HDD for backup storage (sda and sdb in RAID1 managed by BTRFS)
- 1.4 TB HDD for external backup storage (sdi, external USB drive)
- and some other partitions on disks for other purposes

View the current disk layout:

```fish
lsblk
# NAME                    MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINTS
# sda                       8:0    0   3.6T  0 disk
# sdb                       8:16   0   3.6T  0 disk
# sdc                       8:32   0 119.2G  0 disk
# ├─sdc1                    8:33   0   976M  0 part  /boot/efi
# ├─sdc2                    8:34   0   977M  0 part  /boot
# └─sdc3                    8:35   0 117.3G  0 part
#   └─sda3_crypt          253:0    0 117.3G  0 crypt
#     ├─debian--vg-root   253:1    0 111.3G  0 lvm   /home
#     │                                              /
#     └─debian--vg-swap_1 253:2    0     6G  0 lvm   [SWAP]
# sdi                       8:128  0   1.4T  0 disk  /media/wmutschl/CORE
# nvme0n1                 259:0    0   1.7T  0 disk
# ├─nvme0n1p1             259:1    0    16M  0 part
# ├─nvme0n1p2             259:2    0  99.6G  0 part
# ├─nvme0n1p3             259:3    0   9.8G  0 part
# └─nvme0n1p4             259:4    0   1.6T  0 part
```

Unlock the encrypted partitions:

```fish
cryptsetup luksOpen /dev/sda crypt_backup1
cryptsetup luksOpen /dev/sdb crypt_backup2
cryptsetup luksOpen /dev/nvme0n1p4 crypt_docker
```

**Note:** I use the same LUKS passphrase across all disks (matching the system disk), so at reboot I only enter it once and it's automatically passed to the other disks.

Create mount points and set ownership:

```fish
mkdir -p /btrfs_backup /btrfs_docker /home/wmutschl/docker /home/wmutschl/vm /var/lib/docker
chown -R wmutschl:wmutschl /home/wmutschl/vm /home/wmutschl/docker
```

Add the following entries to `/etc/fstab`:

```
#######################
# 2 TB NVME (no RAID) #
#######################
# partition 4 docker user files (cryptsetup luksOpen /dev/nvme0n1p4 crypt_docker)
UUID=b9611a9a-0e1e-4f4b-86ce-f81845dab910  /btrfs_docker         btrfs defaults,compress=zstd:1,discard=async,subvolid=5,x-systemd.after=/       0  0
UUID=b9611a9a-0e1e-4f4b-86ce-f81845dab910  /home/wmutschl/docker btrfs defaults,compress=zstd:1,discard=async,subvol=@docker,x-systemd.after=/   0  0
UUID=b9611a9a-0e1e-4f4b-86ce-f81845dab910  /home/wmutschl/vm     btrfs defaults,compress=zstd:1,discard=async,subvol=@vm,x-systemd.after=/       0  0
# partition 3 docker container files
UUID=43f7fcc8-9668-4042-abe8-7048d703e8b3  /var/lib/docker       ext4  defaults,discard,x-systemd.after=/ 0 0

#############################################################################
# 4 TB HDD BACKUP (2x4TB HDD (Hardware RAID1) + 2x4TB HDD (Hardware RAID1)) #
#############################################################################
UUID=e1963877-fc4d-4412-ba2e-f67e2b865f4b  /btrfs_backup         btrfs defaults,compress=zstd:3,subvolid=5,x-systemd.after=/         0  0
```

Mount all filesystems:

```fish
mount -av
# /btrfs_docker            : successfully mounted
# /home/wmutschl/docker    : successfully mounted
# /home/wmutschl/vm        : successfully mounted
# /var/lib/docker          : successfully mounted
# /btrfs_backup            : successfully mounted
```

Add these lines to `/etc/crypttab` to decrypt disks automatically at boot:

```
crypt_docker  UUID=2b417c1a-3a7e-44a3-881e-79252a509058 none luks,discard
crypt_backup1 UUID=e6be3cc9-e15d-43b6-a2cb-e0a4db5cd871 none luks
crypt_backup2 UUID=3d24ef22-0b76-4e92-b27e-97c2b92d11c6 none luks
```

Update the initramfs:

```fish
update-initramfs -c -k all
```

Reboot and verify the disks are decrypted and mounted correctly:

```fish
lsblk
```


## Server Configuration

### Install Docker

Follow the [official guide](https://docs.docker.com/engine/install/debian/) to install Docker:

```fish
# Remove any old versions
apt remove $(dpkg --get-selections docker.io docker-compose docker-doc podman-docker containerd runc 2>/dev/null | cut -f1)

# Install prerequisites
apt update
apt install ca-certificates curl

# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository
tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

apt update
apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to the docker group
groupadd docker
usermod -aG docker wmutschl  # replace with your username

# Enable and start Docker
systemctl enable docker.service
systemctl enable containerd.service
systemctl start docker
systemctl status docker  # press q to quit
```

Open a new terminal and verify Docker works without root:

```fish
# Run as your normal user, not root
docker run hello-world
# Hello from Docker!
# This message shows that your installation appears to be working correctly.
```

### Deploy Docker containers

Clone my docker-compose repository and deploy the containers:

```fish
# Run as your normal user, not root
git clone https://github.com/wmutschl/scripts.git /home/wmutschl/scripts
cd /home/wmutschl/scripts

# Configure secrets
cp simba.env .env
nano .env

# Deploy containers
docker compose -f simba-docker-compose.yml pull
docker compose -f simba-docker-compose.yml up -d

# Check logs
docker compose -f simba-docker-compose.yml logs swag
docker compose -f simba-docker-compose.yml logs gitea
docker compose -f simba-docker-compose.yml logs mattermost
docker compose -f simba-docker-compose.yml logs mattermost-postgres
```

### Boot into CLI mode

For a server that's primarily accessed remotely, booting to CLI mode saves resources:

```fish
systemctl set-default multi-user.target
```

This boots to a text console instead of the MATE desktop. You can still start the desktop manually with `startx` or connect via NoMachine (which creates a virtual display).

To revert to graphical boot:

```fish
systemctl set-default graphical.target
```

### Disable sleep and hibernation

As this is an always-on server, I completely disable sleep and hibernation using `mask` (more robust than `disable` as it prevents targets from being started entirely):

```fish
systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
# Created symlink /etc/systemd/system/sleep.target → /dev/null.
# Created symlink /etc/systemd/system/suspend.target → /dev/null.
# Created symlink /etc/systemd/system/hibernate.target → /dev/null.
# Created symlink /etc/systemd/system/hybrid-sleep.target → /dev/null.
```

To undo this later:

```fish
systemctl unmask sleep.target suspend.target hibernate.target hybrid-sleep.target
```


## Desktop Environment

Open the settings application and go through each panel to customize your preferences.


## Shell and Applications

### Fish - A friendly interactive shell

I use the [Fish shell](https://fedoramagazine.org/fish-a-friendly-interactive-shell/) on all my systems for its user-friendly features:

```fish
apt install -y fish
```

Switch to Fish as your default shell:

```fish
# Run as your normal user, not root
chsh -s /usr/bin/fish
```

Log out and back in for the change to take effect.

Add `~/.local/bin` to your PATH [persistently](https://github.com/fish-shell/fish-shell/issues/527) in Fish:

```fish
# Run as your normal user, not root
mkdir -p /home/$USER/.local/bin
set -Ua fish_user_paths /home/$USER/.local/bin
```

### Flatpak support

Debian Trixie includes Flatpak support. Set it up and add Flathub:

```fish
apt install flatpak
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

Log out and back in for the changes to take effect.
