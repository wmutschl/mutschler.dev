---
title: 'WIP: Pop!_OS: Things to do after installation (Apps, Settings, and Tweaks)'
summary: In the following I will go through my post installation steps on Pop!_OS, i.e. apps, system configuration, remote access setup, security hardening, and various optimizations.
header:
  image: "Linux_Pop_OS!_penguin_Tux.png"
  caption: "Image credit: [**Linux_Pop_OS!_penguin_Tux by Jayaguru-Shishya**](https://commons.wikimedia.org/wiki/File:Linux_Pop_OS!_penguin_Tux.png)"
tags: ["linux", "pop-os", "install guide", "post install"]
date: 2025-12-15
type: book
---

***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev). Pull requests are very much appreciated.***
<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

In the following I will go through my post installation steps on Pop!_OS.
I use this machine primarily as a server, but still need a desktop environment for certain tasks. The guide therefore covers apps, system configuration, remote access setup, security hardening, and various optimizations that I perform after [installing Pop!_OS 24.04 with BTRFS, LUKS encryption and auto snapshots with Timeshift](../pop-os-btrfs-24-04).

{{< toc hide_on="xl" >}}

## Initial System Setup

### Install some essential command line utility

```fish
sudo apt install screen fish
```

### Install and configure OpenSSH Server

Since I access this machine primarily via SSH, this is one of the first services I set up:

```fish
sudo apt install -y openssh-server
```

Configure SSH settings:

```fish
sudo nano /etc/ssh/sshd_config
```

Add or modify the following at the bottom of the file:

```
PermitRootLogin yes
PasswordAuthentication no
X11Forwarding yes
```

Enable and start the SSH service:

```fish
sudo systemctl enable ssh
sudo systemctl start ssh
```

#### Generate or restore SSH keys

To create a new SSH key:

```fish
ssh-keygen -t ed25519 -C "pop-os"
```

Usually, I restore my `.ssh` folder from backup instead. Either way, add your key to the ssh-agent:

```fish
eval "$(ssh-agent -s)"  # for bash
eval (ssh-agent -c)     # for fish
ssh-add ~/.ssh/id_ed25519
```

Don't forget to add your public key to GitHub, GitLab, servers, etc.

#### Configure authorized keys for incoming connections

```fish
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


#### Fish - A Friendly Interactive Shell
I am trying out the Fish shell, due to its [user-friendly features](https://fedoramagazine.org/fish-a-friendly-interactive-shell/), so I install it and make it my default shell:
```sh
sudo apt install -y fish
chsh -s /usr/bin/fish
```
You will need to log out and back in for this change to take effect. Lastly, I want to add the ~/.local/bin to my $PATH [persistently](https://github.com/fish-shell/fish-shell/issues/527) in Fish:
```sh
mkdir -p /home/$USER/.local/bin
set -Ua fish_user_paths /home/$USER/.local/bin
```
Also I make sure that it is in my $PATH also on bash:
```sh
bash -c 'echo $PATH'
#/home/$USER/.local/bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin
```
If it isn't then I make the necessary changes in my `.bashrc`.



### Install and configure Tailscale

I use [Tailscale](https://tailscale.com/kb/1626/install-debian-trixie) on all my systems to connect them via WireGuard from anywhere. Installation is straightforward:

```fish
curl -fsSL https://pkgs.tailscale.com/stable/debian/trixie.noarmor.gpg | tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null
curl -fsSL https://pkgs.tailscale.com/stable/debian/trixie.tailscale-keyring.list | tee /etc/apt/sources.list.d/tailscale.list

curl -fsSL https://tailscale.com/install.sh | sh
```

Connect your machine to your Tailscale network:

```fish
sudo tailscale up
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
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
sudo tailscale up --advertise-exit-node
# Warning: UDP GRO forwarding is suboptimally configured on ens10f0np0, UDP forwarding throughput # capability will increase with a configuration change.
# See https://tailscale.com/s/ethtool-config-udp-gro
```

Then enable the exit node in your Tailscale admin console.

#### Fix UDP GRO forwarding for better throughput

When running as an exit node or subnet router, Tailscale may warn about suboptimal UDP GRO forwarding. This [optimization](https://tailscale.com/s/ethtool-config-udp-gro) improves UDP throughput on Linux 6.2+ kernels:

```fish
NETDEV=$(ip -o route get 8.8.8.8 | cut -f 5 -d " ")
sudo ethtool -K $NETDEV rx-udp-gro-forwarding on rx-gro-list off

systemctl is-enabled networkd-dispatcher

printf '#!/bin/sh\n\nethtool -K %s rx-udp-gro-forwarding on rx-gro-list off \n' "$(ip -o route get 8.8.8.8 | cut -f 5 -d " ")" | sudo tee /etc/networkd-dispatcher/routable.d/50-tailscale
sudo chmod 755 /etc/networkd-dispatcher/routable.d/50-tailscale

sudo /etc/networkd-dispatcher/routable.d/50-tailscale
test $? -eq 0 || echo 'An error occurred.'

```
You should see no error messages.

### Install NoMachine for remote desktop

{{< callout warning >}}
As of December 2025, NoMachine doesn't work well with Wayland, so I need to re-visit this step.
{{< /callout >}}

NoMachine provides excellent remote desktop access. You may need to adjust the version and URL:

```fish
cd /tmp
curl -O https://web9001.nomachine.com/download/9.2/Linux/nomachine_9.2.18_3_amd64.deb
sudo apt install ./nomachine_9.2.18_3_amd64.deb
```

Launch NoMachine and configure it. I enable "always run" mode.

To troubleshoot connection issues, restart the NoMachine server:

```fish
/usr/NX/bin/nxserver --restart
```

## Security Hardening

### Lock down server with UFW (allow only Tailscale)

{{< callout note >}}
Before locking down the server, exit your current SSH session and reconnect using the Tailscale IP to ensure you won't lose access:

```
ssh username@100.x.y.z
ssh wmutschl@pop-os  # if using Magic DNS with hostname "pop-os"
```
{{< /callout >}}

Since I access this machine primarily over Tailscale, I [lock it down using UFW](https://tailscale.com/kb/1077/secure-server-ubuntu) to only accept connections from the Tailscale interface:

```fish
sudo apt install -y ufw
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow in on tailscale0
```

Check the status:

```fish
sudo ufw status verbose
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
sudo ufw delete allow 22/tcp
sudo ufw reload
sudo systemctl restart ssh
```

Because I am running a website on this machine, I need to allow port 80 and 443:

```fish
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Check the status:

```fish
sudo ufw status verbose
# Status: active
# Logging: on (low)
# Default: deny (incoming), allow (outgoing), deny (routed)
# New profiles: skip
#
# To                         Action      From
# --                         ------      ----
# Anywhere on tailscale0     ALLOW IN    Anywhere
# 80/tcp                     ALLOW IN    Anywhere
# 443/tcp                    ALLOW IN    Anywhere
# Anywhere (v6) on tailscale0 ALLOW IN    Anywhere (v6)
# 80/tcp (v6)                ALLOW IN    Anywhere (v6)
# 443/tcp (v6)               ALLOW IN    Anywhere (v6)
```

### Enable TRIM for SSDs

If you have an SSD or NVMe drive, enabling TRIM helps maintain performance over time. Check if the fstrim timer is enabled:

```fish
sudo systemctl status fstrim.timer
#      Loaded: loaded (/usr/lib/systemd/system/fstrim.timer; enabled; preset: enabled)
```

If not enabled, enable and start it:

```fish
sudo systemctl enable fstrim.timer
sudo systemctl start fstrim.timer
```

You can also run TRIM manually:

```fish
sudo fstrim -av
# /btrfs_docker: 607.6 GiB (652451688448 bytes) trimmed on /dev/mapper/crypt_docker
# /boot/efi: 965.3 MiB (1012170752 bytes) trimmed on /dev/sdc1
# /boot: 779.4 MiB (817225728 bytes) trimmed on /dev/sdc2
# /var/lib/docker: 80 GiB (85931634688 bytes) trimmed on /dev/nvme0n1p2
# /: 104.7 GiB (112431742976 bytes) trimmed on /dev/mapper/debian--vg-root
```

### Fix IO_PAGE_FAULT errors (AMD systems)

On AMD systems with IOMMU, you may encounter IO_PAGE_FAULT errors in the kernel log:

```fish
sudo dmesg --level=emerg,err,warn
# [  812.086690] ahci 0000:02:00.0: AMD-Vi: Event logged [IO_PAGE_FAULT domain=0x0043 address=0xecdd5004 flags=0x0070]
```

This [video](https://www.youtube.com/watch?v=wJN3e8Usmzw) explains the problem and solution. To fix it, we need to add some options to kernestub:

```fish
sudo kernelstub -a "amd-iommu=on iommu=pt"
cat /etc/kernelstub/configuration
#   "user": {
#     "kernel_options": [
#       "quiet",
#       "loglevel=0",
#       "systemd.show_status=false",
#       "splash",
#       "rootflags=subvol=@",
#       "",
#       "amd-iommu=on",
#       "iommu=pt"
#     ],
```

Now let's reboot and check if the errors are gone:
```fish
sudo reboot
```

Check the logs:

```fish
sudo dmesg --level=emerg,err,warn
```

If you see no errors, then the problem is fixed.


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
# NAME            MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINTS
# sda               8:0    0   3.6T  0 disk
# sdb               8:16   0   3.6T  0 disk
# sdc               8:32   0 119.2G  0 disk
# ├─sdc1            8:33   0  1022M  0 part  /boot/efi
# ├─sdc2            8:34   0     4G  0 part  /recovery
# ├─sdc3            8:35   0 110.2G  0 part
# │ └─cryptdata   252:0    0 110.2G  0 crypt
# │   └─data-root 252:1    0 110.2G  0 lvm   /home
# │                                          /
# └─sdc4            8:36   0     4G  0 part
#   └─cryptswap   252:2    0     4G  0 crypt [SWAP]
# sdd               8:48   0   1.4T  0 disk
# sde               8:64   1  29.3G  0 disk
# ├─sde1            8:65   1   2.9G  0 part
# ├─sde2            8:66   1     4M  0 part
# └─sde3            8:67   1  26.4G  0 part
# zram0           251:0    0    16G  0 disk  [SWAP]
# nvme0n1         259:0    0   1.7T  0 disk
# ├─nvme0n1p1     259:1    0    16M  0 part
# ├─nvme0n1p2     259:2    0  99.6G  0 part
# ├─nvme0n1p3     259:3    0   9.8G  0 part
# └─nvme0n1p4     259:4    0   1.6T  0 part
```

Unlock the encrypted partitions:

```fish
sudo cryptsetup luksOpen /dev/sda crypt_backup1
sudo cryptsetup luksOpen /dev/sdb crypt_backup2
sudo cryptsetup luksOpen /dev/nvme0n1p4 crypt_docker
```

{{< callout note >}}
I use the same LUKS passphrase across all disks (matching the system disk), so at reboot I only enter it once and it's automatically passed to the other disks. Good to know :-)
{{< /callout >}}

Create mount points and set ownership:

```fish
sudo mkdir -p /btrfs_backup /btrfs_docker /home/wmutschl/docker /home/wmutschl/vm /var/lib/docker
sudo chown -R wmutschl:wmutschl /home/wmutschl/vm /home/wmutschl/docker
```

Add the following entries to `/etc/fstab`:

```
#######################
# 2 TB NVME (no RAID) #
#######################
# partition 4 docker user files (cryptsetup luksOpen /dev/nvme0n1p4 crypt_docker)
UUID=b9611a9a-0e1e-4f4b-86ce-f81845dab910  /btrfs_docker         btrfs defaults,compress=zstd:1,subvolid=5,x-systemd.after=/       0  0
UUID=b9611a9a-0e1e-4f4b-86ce-f81845dab910  /home/wmutschl/docker btrfs defaults,compress=zstd:1,subvol=@docker,x-systemd.after=/   0  0
UUID=b9611a9a-0e1e-4f4b-86ce-f81845dab910  /home/wmutschl/vm     btrfs defaults,compress=zstd:1,subvol=@vm,x-systemd.after=/       0  0
# partition 3 docker container files
UUID=43f7fcc8-9668-4042-abe8-7048d703e8b3  /var/lib/docker       ext4  defaults,x-systemd.after=/ 0 0

#############################################################################
# 4 TB HDD BACKUP (2x4TB HDD (Hardware RAID1) + 2x4TB HDD (Hardware RAID1)) #
#############################################################################
UUID=e1963877-fc4d-4412-ba2e-f67e2b865f4b  /btrfs_backup         btrfs defaults,compress=zstd:3,subvolid=5,x-systemd.after=/         0  0
```

Mount all filesystems:

```fish
sudo mount -av
# /boot/efi                : already mounted
# /recovery                : already mounted
# none                     : ignored
# /                        : ignored
# /home                    : already mounted
# mount: (hint) your fstab has been modified, but systemd still uses
#        the old version; use 'systemctl daemon-reload' to reload.
# /btrfs_docker            : successfully mounted
# /home/wmutschl/docker    : successfully mounted
# /home/wmutschl/vm        : successfully mounted
# /var/lib/docker          : successfully mounted
```

Add these lines to `/etc/crypttab` to decrypt disks automatically at boot:

```
crypt_docker  UUID=2b417c1a-3a7e-44a3-881e-79252a509058 none luks
crypt_backup1 UUID=e6be3cc9-e15d-43b6-a2cb-e0a4db5cd871 none luks
crypt_backup2 UUID=3d24ef22-0b76-4e92-b27e-97c2b92d11c6 none luks
```

Update the initramfs:

```fish
sudo update-initramfs -c -k all
```

Reboot and verify the disks are decrypted and mounted correctly:

```fish
sudo lsblk
# NAME             MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINTS
# sda                8:0    0   3.6T  0 disk
# └─crypt_backup1  252:5    0   3.6T  0 crypt /btrfs_backup
# sdb                8:16   0   3.6T  0 disk
# └─crypt_backup2  252:3    0   3.6T  0 crypt
# sdc                8:32   0 119.2G  0 disk
# ├─sdc1             8:33   0  1022M  0 part  /boot/efi
# ├─sdc2             8:34   0     4G  0 part  /recovery
# ├─sdc3             8:35   0 110.2G  0 part
# │ └─cryptdata    252:0    0 110.2G  0 crypt
# │   └─data-root  252:1    0 110.2G  0 lvm   /home
# │                                           /
# └─sdc4             8:36   0     4G  0 part
#   └─cryptswap    252:2    0     4G  0 crypt [SWAP]
# sdd                8:48   0   1.4T  0 disk
# sde                8:64   1  29.3G  0 disk
# ├─sde1             8:65   1   2.9G  0 part
# ├─sde2             8:66   1     4M  0 part
# └─sde3             8:67   1  26.4G  0 part
# zram0            251:0    0    16G  0 disk  [SWAP]
# nvme0n1          259:0    0   1.7T  0 disk
# ├─nvme0n1p1      259:1    0    16M  0 part
# ├─nvme0n1p2      259:2    0  99.6G  0 part  /var/lib/docker
# ├─nvme0n1p3      259:3    0   9.8G  0 part
# └─nvme0n1p4      259:4    0   1.6T  0 part
#   └─crypt_docker 252:4    0   1.6T  0 crypt /home/wmutschl/docker
#                                             /home/wmutschl/vm
#                                             /btrfs_docker
sudo mount -av
# /boot/efi                : already mounted
# /recovery                : already mounted
# none                     : ignored
# /                        : ignored
# /home                    : already mounted
# /btrfs_docker            : already mounted
# /home/wmutschl/docker    : already mounted
# /home/wmutschl/vm        : already mounted
# /var/lib/docker          : already mounted

sudo btrfs filesystem show /
# Label: none  uuid: f18b85ef-a467-4664-8b59-2798c6ce80d3
# 	Total devices 1 FS bytes used 11.41GiB
# 	devid    1 size 110.16GiB used 15.02GiB path /dev/mapper/data-root

sudo btrfs filesystem show /btrfs_backup
# Label: none  uuid: e1963877-fc4d-4412-ba2e-f67e2b865f4b
# 	Total devices 2 FS bytes used 2.11TiB
# 	devid    1 size 3.64TiB used 2.19TiB path /dev/mapper/crypt_backup1
# 	devid    2 size 3.64TiB used 2.19TiB path /dev/mapper/crypt_backup2

sudo btrfs filesystem show /btrfs_docker
# Label: none  uuid: b9611a9a-0e1e-4f4b-86ce-f81845dab910
# 	Total devices 1 FS bytes used 1.05TiB
# 	devid    1 size 1.64TiB used 1.18TiB path /dev/mapper/crypt_docker
```


## Server Configuration

### Install Docker

Follow the [official guide](https://docs.docker.com/engine/install/ubuntu/) to install Docker:

```fish
# Remove any old versions
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc | cut -f1)

# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources (copy all files to last EOF):
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

# Install the Docker packages
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to the docker group
sudo groupadd docker
sudo usermod -aG docker wmutschl  # replace with your username
newgrp docker # or logout and login again

# Enable and start Docker
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
sudo systemctl start docker
sudo systemctl status docker
```

Verify Docker works without root:

```fish
docker run hello-world
# Hello from Docker!
# This message shows that your installation appears to be working correctly.
```

### Deploy Docker containers

Clone my docker-compose repository and deploy the containers:

```fish
# Run as your normal user, not root
git clone git@github.com:wmutschl/scripts.git /home/$USER/scripts
cd /home/$USER/scripts

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

### Enable BTRBK snapshots and backups

First I need to mount the system top root to /btrfs_pool:

```fish
sudo nano /etc/fstab
# UUID=f18b85ef-a467-4664-8b59-2798c6ce80d3  /  btrfs  defaults,compress=zstd:1,subvol=@  0  0
# UUID=f18b85ef-a467-4664-8b59-2798c6ce80d3  /home  btrfs  defaults,compress=zstd:1,subvol=@home  0  0
# UUID=f18b85ef-a467-4664-8b59-2798c6ce80d3  /btrfs_pool  btrfs  defaults,compress=zstd:1,subvolid=5  0  0

sudo mkdir -p /btrfs_pool/btrbk_snapshots
sudo mount -av
```

```fish
sudo apt install btrbk
btrbk --version
btrbk command line client, version 0.32.5
```

Check my configuration file:
```fish
cd $HOME/scripts
sudo btrbk -c simba-btrbk.conf dryrun
sudo btrbk -c simba-btrbk.conf run -v --progress
```

### Check whether btrfs balance and btrfs scrub scripts are working

```fish
```

### Adjust crontab for maintenance tasks

```fish
mkdir -p $HOME/logs
sudo crontab -e
```

Add the following lines to the crontab (need to adapt the URLs to the healthchecks.io base urls).

```
# Ping if server is up
* * * * *   curl -fsS --retry 5 -o /dev/null https://hc-ping.com/XXX

# BTRFS snapshots and backups with BTRBK
0 * * * *    /home/wmutschl/scripts/btrfs-btrbk.sh               >> /home/wmutschl/logs/btrfs-btrbk.log                  2>&1

# BTRFS maintenance: balance
15 3 * * SUN /home/wmutschl/scripts/btrfs-balance.sh             >> /home/wmutschl/logs/btrfs-balance.log                2>&1

# BTRFS maintenance: scrub
15 23 1 * *  /home/wmutschl/scripts/btrfs-scrub.sh               >> /home/wmutschl/logs/btrfs-scrub.log                  2>&1
```
### Boot into CLI mode

For a server that's primarily accessed remotely, booting to CLI mode saves resources:

```fish
sudo systemctl set-default multi-user.target
```

This boots to a text console instead of the COSMIC desktop. You can still start the desktop manually with `startx` or connect via NoMachine (which creates a virtual display).

To revert to graphical boot:

```fish
sudo systemctl set-default graphical.target
```


## Basic Steps

### Set hostname
By default my machine is called `pop-os`; if you want to change it, you can do so with:
```sh
hostnamectl set-hostname simba
```

#### Change the mirror for getting updates, set locales, get rid of unnecessary languages
I am living in Germany, so I adapt my locales:
```bash
sudo locale-gen de_DE.UTF.8
sudo locale-gen en_US.UTF.8
sudo update-locale LANG=en_US.UTF-8
```
In Region Settings open "Manage Installed Languages", do not update these, but first remove the unnecessary ones. Then reopen "languages" and update these.

#### Install updates and reboot
```bash
sudo apt update
sudo apt upgrade
sudo apt dist-upgrade
sudo apt autoremove
sudo apt autoclean
sudo fwupdmgr get-devices
sudo fwupdmgr get-updates
sudo fwupdmgr update
flatpak update
sudo pop-upgrade recovery upgrade from-release # this updates the recovery partition
sudo reboot now
```


#### Set Hybrid Graphics
[Switching Graphics in Pop!_OS](https://support.system76.com/articles/graphics-switch-pop/) is easy: either use the provided extension and restart or run
```bash
sudo system76-power graphics hybrid
sudo reboot now
```

#### Get Thunderbolt Dock to work and adjust monitors
I use a Thunderbolt Dock (DELL TB16 or Anker PowerExpand Elite 13-in-1 or builtin into my LG 38 curved monitor), which is great but also a bit tricky to set up (see [Dell TB16 Archwiki](https://wiki.archlinux.org/index.php/Dell_TB16)). I noticed that sometimes I just need to plug the USB-C cable in and out a couple of times to make it work (there seems to be a loose contact). Anyways, for me the most important step is to check in "Settings-Privacy-Thunderbolt", whether the Thunderbolt dock works, so I can rearrange my monitors in "monitor settings".

#### Restore from Backup
I mount my luks encrypted backup storage drive using nautilus and use rsync to copy over my files and important configuration scripts:
```bash
export BACKUP=/media/$USER/UUIDOFBACKUPDRIVE/@home/$USER/
sudo rsync -avuP $BACKUP/Pictures ~/
sudo rsync -avuP $BACKUP/Documents ~/
sudo rsync -avuP $BACKUP/Downloads ~/
sudo rsync -avuP $BACKUP/dynare ~/
sudo rsync -avuP $BACKUP/Images ~/
sudo rsync -avuP $BACKUP/Music ~/
sudo rsync -avuP $BACKUP/Desktop ~/
sudo rsync -avuP $BACKUP/SofortUpload ~/
sudo rsync -avuP $BACKUP/Videos ~/
sudo rsync -avuP $BACKUP/Templates ~/
sudo rsync -avuP $BACKUP/Work ~/
sudo rsync -avuP $BACKUP/.config/Nextcloud ~/.config/
sudo rsync -avuP $BACKUP/.gitkraken ~/
sudo rsync -avuP $BACKUP/.gnupg ~/
sudo rsync -avuP $BACKUP/.local/share/applications ~/.local/share/
sudo rsync -avuP $BACKUP/.matlab ~/
sudo rsync -avuP $BACKUP/.ssh ~/
sudo rsync -avuP $BACKUP/.dynare ~/
sudo rsync -avuP $BACKUP/.gitconfig ~/

sudo chown -R $USER:$USER /home/$USER
```

#### Sync Firefox to access password manager
I use Firefox and like to keep my bookmarks and extensions in sync. Particularly, I use Bitwarden for all my passwords.


### SSH keys
If I want to create a new SSH key, I run e.g.:
```sh
ssh-keygen -t ed25519 -C "popos-on-precision"
```
Usually, however, I restore my `.ssh` folder from my backup (see above). Either way, afterwards, one needs to add the file containing your key, usually `id_rsa` or `id_ed25519`, to the ssh-agent:
```sh
eval "$(ssh-agent -s)" #works in bash
eval (ssh-agent -c) #works in fish
ssh-add ~/.ssh/id_ed25519
```
Don't forget to add your public key to GitHub, Gitlab, Servers, etc.


## Security steps with Yubikey
I have two Yubikeys and use them
- as second-factor for all admin/sudo tasks
- to unlock my luks encrypted partitions
- for my private GPG key

For this I need to install several packages:
```bash
sudo apt install -y yubikey-manager yubikey-personalization # some common packages
# Insert the yubikey
ykman info # your key should be recognized
# Device type: YubiKey 5 NFC
# Serial number:
# Firmware version: 5.1.2
# Form factor: Keychain (USB-A)
# Enabled USB interfaces: OTP+FIDO+CCID
# NFC interface is enabled.
#
# Applications	USB    	NFC
# OTP     	Enabled	Enabled
# FIDO U2F	Enabled	Enabled
# OpenPGP 	Enabled	Enabled
# PIV     	Enabled	Disabled
# OATH    	Enabled	Enabled
# FIDO2   	Enabled	Enabled

sudo apt install -y libpam-u2f # second-factor for sudo commands
sudo apt install -y yubikey-luks  # second-factor for luks
sudo apt install -y gpg scdaemon gnupg-agent pcscd gnupg2 # stuff for GPG
```

Make sure that OpenPGP and PIV are enabled on both Yubikeys as shown above.

#### Yubikey: two-factor authentication for admin/sudo password
Let's set up the Yubikeys as second-factor for everything related to sudo using the common-auth pam.d module:
```bash
pamu2fcfg > ~/u2f_keys # When your device begins flashing, touch the metal contact to confirm the association. You might need to insert a user pin as well
pamu2fcfg -n >> ~/u2f_keys # Do the same with your backup device
sudo mv ~/u2f_keys /etc/u2f_keys
# Make this required for common-auth
echo "auth    required                        pam_u2f.so nouserok authfile=/etc/u2f_keys cue" | sudo tee -a /etc/pam.d/common-auth
```
Before you close the terminal, open a new one and check whether you can do `sudo echo test`

#### Yubikey: two-factor authentication for luks partitions
Let's set up the Yubikeys as second-factor to unlock the luks partitions. If you have brand new keys, then create a new key on them:
```bash
ykpersonalize -2 -ochal-resp -ochal-hmac -ohmac-lt64 -oserial-api-visible #BE CAREFUL TO NOT OVERWRITE IF YOU HAVE ALREADY DONE THIS
```
Now we can enroll both yubikeys to the luks partition:
```bash
export LUKSDRIVE=/dev/nvme0n1p4
#insert first yubikey
sudo yubikey-luks-enroll -d $LUKSDRIVE -s 7 # first yubikey
#insert second yubikey
sudo yubikey-luks-enroll -d $LUKSDRIVE -s 8 # second yubikey
export CRYPTKEY="luks,keyscript=/usr/share/yubikey-luks/ykluks-keyscript"
sudo sed -i "s|luks|$CRYPTKEY|" /etc/crypttab
cat /etc/crypttab #check whether this looks okay
sudo update-initramfs -u
```

#### Yubikey: private GPG key
Let's use the private GPG key on the Yubikey (a tutorial on how to put it there is taken from [Heise](https://www.heise.de/ratgeber/FIDO2-YubiKey-als-OpenPGP-Smartcard-einsetzen-4590032.html) or [YubiKey-Guide](https://github.com/drduh/YubiKey-Guide)). My public key is given in a file called `/home/$USER/.gnupg/public.asc`:
```bash
sudo systemctl enable pcscd
sudo systemctl start pcscd
# Insert yubikey
gpg --card-status
# If this did not find your Yubikey, then try to first reboot.
# If it still does not work, then put
# echo 'reader-port Yubico YubiKey' >> ~/.gnupg/scdaemon.conf
# reboot and try again. Make sure to enable pcscd.
cd ~/.gnupg
gpg --import public.asc #this is my public key, my private one is on my yubikey
export KEYID=91E724BF17A73F6D
gpg --edit-key $KEYID
  trust
  5
  y
  quit
echo "This is an encrypted message" | gpg --encrypt --armor --recipient $KEYID -o encrypted.txt
gpg --decrypt --armor encrypted.txt
# If this did not trigger to enter the Personal Key on your Yubikey, then try to put
# echo 'reader-port Yubico YubiKey' >> ~/.gnupg/scdaemon.conf
# reboot and try again. Make sure to enable pcscd.
```





## Apps

### Snap support
Enable snap support
```bash
sudo apt install snapd
```


### System utilities

#### Caffeine
A little helper in case my laptop needs to stay up all night
```bash
sudo apt install -y caffeine
```
Run caffeine indicator.


#### Flatseal
Flatseal is a great tool to check or change the permissions of your flatpaks:
```bash
flatpak install flatseal
```

#### GParted
In case I need to adjust the partition layout:
```bash
sudo apt install -y gparted
```
Open GParted, check whether it works.


#### Gnome-tweaks
Using gnome tweaks
```bash
sudo apt install gnome-tweaks
```
In Gnome Tweaks I make the following changes:

- Disable "Suspend when laptop lid is closed" in General
- Disable "Activities Overview Hot Corner" in Top Bar
- Enable "Weekday" and "Date" in "Top Bar"
- Enable Battery Percentage (also possible in Gnome Settings - Power)
- Check Autostart programs
- Put the window controls to the left and disable the minimize button


#### nautilus-admin
Right-click context menu in nautilus for admin
```bash
sudo apt install -y nautilus-admin
```


#### Virtual machines: Quickemu and other stuff
I used to set up KVM, Qemu, virt-manager and gnome-boxes as this is much faster as VirtualBox. However, I have found a much easier tool for most tasks: [Quickqemu](https://github.com/wmutschl/quickemu) which uses the snap package Qemu-virgil:
```bash
git clone https://github.com/wmutschl/quickemu ~/quickemu
sudo apt install snapd bsdgames wget
sudo snap install qemu-virgil
sudo snap connect qemu-virgil:kvm
sudo snap connect qemu-virgil:raw-usb
sudo snap connect qemu-virgil:removable-media
sudo snap connect qemu-virgil:audio-record
sudo ln -s ~/quickemu/quickemu /home/$USER/.local/bin/quickemu
# Note that I keep my virtual machines on an external SSD
```
In case I need the old stuff:
```bash
sudo apt install -y qemu-kvm libvirt-clients libvirt-daemon-system bridge-utils virt-manager libvirt-daemon ovmf gnome-boxes
sudo adduser $USER libvirt
sudo adduser $USER libvirt-qemu
# run gnome-boxes
# run libvirt add user session
# As I use btrfs I need to change compression of images to no:
sudo chattr +C ~/.local/share/gnome-boxes
sudo chattr +C ~/.local/share/libvirt
```


### Networking

#### OpenSSH Server
I sometimes access my linux machine via ssh from other machines, for this I install the OpenSSH server:
```bash
sudo apt install openssh-server
```
Then I make some changes to
```bash
sudo nano /etc/ssh/sshd_config
```
to disable password login and to allow for X11forwarding.

#### Nextcloud
I have all my files synced to my own Nextcloud server, so I need the sync client:
```bash
sudo apt install -y nextcloud-desktop
```
Open Nextcloud and set it up. Recheck options.


#### OpenConnect and OpenVPN
```bash
sudo apt install -y openconnect network-manager-openconnect network-manager-openconnect-gnome
sudo apt install -y openvpn network-manager-openvpn network-manager-openvpn-gnome
```
Go to Settings-Network-VPN and add openconnect for my university VPN and openvpn for ProtonVPN, check connections.

### Coding

#### Dynare related packages
I am a developer of [Dynare](https://www.dynare.org) and need these packages to compile it from source and run it optimally ob Ubuntu-based systems:
```bash
sudo apt install -y build-essential gfortran liboctave-dev libboost-graph-dev libgsl-dev libmatio-dev libslicot-dev libslicot-pic libsuitesparse-dev flex bison autoconf automake texlive texlive-publishers texlive-latex-extra texlive-fonts-extra texlive-latex-recommended texlive-science texlive-plain-generic lmodern python3-sphinx latexmk libjs-mathjax doxygen x13as
```

#### git related packages:
git is most important, as a GUI for it, I use GitKraken. Also to use lfs on some repositories one needs to initialize it once:
```bash
sudo apt install -y git git-lfs
git-lfs install
flatpak install -y gitkraken
```
The flatpak version of GitKraken works perfectly. Open GitKraken and set up Accounts and Settings. Note that in case of flatpak, one needs to add the following Custom Terminal Command: `flatpak-spawn --host gnome-terminal %d`.

#### MATLAB
I have a license for MATLAB, unzipping the installation files in the the home folder and running:
```bash
sudo mkdir -p /usr/local/MATLAB/R2021a
sudo chown -R $USER:$USER /usr/local/MATLAB
/home/$USER/matlab_R2021a_glnxa64/install
```
On Ubuntu based systems it is always recommended to install `matlab-support` which renames/excludes the GCC libraries that ship with MATLAB such that we can use the ones from our distro:
```bash
sudo apt install -y matlab-support
```
Run matlab and activate it. Note that there is still a [shared resources-for-x11-graphics bug](https://de.mathworks.com/matlabcentral/answers/342906-could-not-initialize-shared-resources-for-x11graphicsdevice#answer_425485?s_tid=prof_contriblnk), which can be solved by
```bash
#this solves the shared resources for x11 graphics bug
echo "-Djogl.disable.openglarbcontext=1" > /usr/local/MATLAB/R2021a/bin/glnxa64/java.opts
```
Run matlab and I change some settings to use Windows type shortcuts on the Keyboard, add `mod` and `inc` files as supported extensions, and do not use MATLAB's source control capabilities.


#### Visual Studio Code
I am in the process of transitioning all my coding to Visual Studio code:
```bash
sudo apt install -y code
```
I keep my profiles and extensions synced.

### Text-processing

#### Latex related packages
I write all my papers and presentations with Latex using Visual Studio Code as editor:
```bash
sudo apt install -y texlive texlive-font-utils texlive-pstricks-doc texlive-base texlive-formats-extra texlive-lang-german texlive-metapost texlive-publishers texlive-bibtex-extra texlive-latex-base texlive-metapost-doc texlive-publishers-doc texlive-binaries texlive-latex-base-doc texlive-science texlive-extra-utils texlive-latex-extra texlive-science-doc texlive-fonts-extra texlive-latex-extra-doc texlive-pictures texlive-xetex texlive-fonts-extra-doc texlive-latex-recommended texlive-pictures-doc texlive-fonts-recommended texlive-humanities texlive-lang-english texlive-latex-recommended-doc texlive-fonts-recommended-doc texlive-humanities-doc texlive-luatex texlive-pstricks perl-tk
```
Open texstudio and set it up.


#### Masterpdf
I have purchased a license for Master PDF in case I need advanced PDF editing tools:
```bash
flatpak install -y masterpdf
```
Open masterpdf and enter license. Also I use flatseal to give the app full access to my home folder.


### Communication

#### Mattermost
Our Dynare team communication is happening via Mattermost:
```bash
flatpak install -y mattermost-desktop
```
Open mattermost and connect to server. I find that the snap works best for me in terms of displaying the icon in the tray.

#### Skype
Skype can be installed either via snap or flatpak. I find the flatpak version works better with the system tray icons:
```bash
flatpak install -y skype
```
Open skype, log in and set up audio and video.

#### Zoom
Zoom can be installed either via snap or flatpak. I find the flatpak version works better with the system tray icons:
```bash
flatpak install -y zoom
```
Open zoom, log in and set up audio and video.


### Multimedia

#### VLC
The best video player:
```bash
sudo apt install -y vlc
```
Open it and check whether it works.

#### Multimedia Codecs
Install and compile multimedia codecs:
```bash
sudo apt install -y libavcodec-extra libdvd-pkg; sudo dpkg-reconfigure libdvd-pkg
```

#### OBS
Install:
```bash
sudo apt install -y obs-studio
```
Open OBS and set it up, import your scenes, etc.






## Misc tweaks and settings

#### Reorder Favorites on Dock
I like to reorder the favorites on the dock and add additional ones.

#### Go through all programs
Hit <kbd>META</kbd>+<kbd>A</kbd> and go through all programs, decide whether you need them or uninstall these.


#### Bookmarks for netdrives
Using <kbd>CTRL</kbd>+<kbd>L</kbd> in nautilus, I can add some netdrives:
- university cluster `sftp://palma2c.uni-muenster.de`
- personal homepage `sftp://mutschler.eu`
and add bookmarks to these drives for easy access with nautilus.


#### History search in terminal using page up and page down
When I use bash I like this feature:
```bash
sudo nano /etc/inputrc
# Uncomment "\e[5~": history-search-backward
# Uncomment "\e[6~": history-search-forward
```

#### Go through Settings
- Turn off bluetooth
- Change wallpaper
- Select Light Theme
- Dock
  - Deactivate Extend dock to the edges of the screen
  - Dock visibility: intelligently hide
  - Show Dock on Display: All Displays
- Automatically delete recent files and trash
- Turn of screen after 15 min
- Turn on night mode
- Add online account for Nextcloud
- Deactivate system sounds, mute mic
- Turn of suspend, turn on shutdown for power button
- Turn on natural scroll for mouse touchpad
- Go through keyboard shortcuts and adapt, I also add a custom one for xkill on <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>X</kbd>
- Check region and language, remove unnecessary languages, then update
- Change clock to 24h format
