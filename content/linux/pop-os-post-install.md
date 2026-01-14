---
title: 'Pop!_OS: Things to do after installation (Apps, Settings, and Tweaks)'
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
I use the terminal for most commands, unless otherwise specified.

{{< toc hide_on="xl" >}}

## Initial System Setup

### Essential system settings

Walk through the welcome wizard.
Then I go to settings and:

- Set up display settings
- Set up network connections
- Change power settings, i.e. disable sleep and hibernation

### First round of updates
Next, I do a first round of updates (which often fixes issues with non-detected hardware):

```fish
sudo apt update
sudo apt upgrade
sudo apt dist-upgrade
sudo apt autoremove --purge
sudo apt autoclean
sudo fwupdmgr get-devices
sudo fwupdmgr get-updates
sudo fwupdmgr update
flatpak update
```

### Set hostname
By default my machine is called `ubuntu`; if you want to change it, you can do so with:

```fish
hostnamectl set-hostname simba
```

### Set locales
I am living in Germany, so I adapt my locales:
```fish
sudo locale-gen de_DE.UTF.8
sudo locale-gen en_US.UTF.8
sudo update-locale LANG=en_US.UTF-8
```

### Fix IO_PAGE_FAULT errors (AMD systems)

On AMD systems with IOMMU, you may encounter `IO_PAGE_FAULT` errors in the kernel log:

```fish
sudo dmesg --level=emerg,err,warn
# [  812.086690] ahci 0000:02:00.0: AMD-Vi: Event logged [IO_PAGE_FAULT domain=0x0043 address=0xecdd5004 flags=0x0070]
```

This [video](https://www.youtube.com/watch?v=wJN3e8Usmzw) explains the problem and solution. To fix it, we need to add some options to kernelstub:

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

Now let's clean the logs and reboot to check if the errors are gone:

```fish
sudo dmesg --clear
sudo reboot
```

Check the logs:

```fish
sudo dmesg --level=emerg,err,warn
```

If you see no errors, then the problem is fixed.

## OpenSSH

### Install and configure OpenSSH Server

Since I access this machine primarily via SSH, this is one of the first services I set up, I also install `screen` to make sure my SSH connection is not interrupted.

```fish
sudo apt install -y openssh-server screen
```
Once this is done, I usually connect via SSH for all other commands.

Next, let's configure SSH settings by adding the following settings to the bottom of `/etc/ssh/sshd_config`:

```fish
echo "## My Settings" | sudo tee -a /etc/ssh/sshd_config
echo "PermitRootLogin yes" | sudo tee -a /etc/ssh/sshd_config
echo "PasswordAuthentication no" | sudo tee -a /etc/ssh/sshd_config
echo "AllowUsers ${USER}" | sudo tee -a /etc/ssh/sshd_config
```

Enable and start the SSH service:

```fish
sudo systemctl enable ssh
sudo systemctl start ssh
```

### Generate or restore SSH keys

To create a new SSH key:

```fish
ssh-keygen -t ed25519 -C "simba"
```

Usually, I restore my `.ssh` folder from backup instead. Either way, add your key to the ssh-agent:

```fish
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

Don't forget to add your public key to GitHub, GitLab, servers, etc.

### Configure authorized keys for incoming connections

Create or edit your authorized_keys file (with correct permissions) and add your public keys:
```fish
cat << EOF > ~/.ssh/authorized_keys
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJID7JVno+R8RzuCYQAV66VnZOgpuwNpQnzFiiX3tT6Q MacBook
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFSlhZlx/+KMV9LG6v8W55UAkc+aOvS8W9r1oVRH+yYq Mac Mini
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGVN/LM0sCk4sacciihBlycWHqtQUpm4KCCvBl5IdlAm iPhone
EOF

chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chown -R $USER:$USER ~/.ssh
```

## Tailscale

I use [Tailscale](https://tailscale.com/kb/1626/install-debian-trixie) on all my systems to connect them via WireGuard from anywhere.

### Install and configure Tailscale

Installation is straightforward and follows the instructions on the Tailscale website:

```fish
sudo apt install curl
curl -fsSL https://tailscale.com/install.sh | sh
```

Connect your machine to your Tailscale network (wait a couple of seconds until the url is displayed):

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

### Configure as exit node

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

### Fix UDP GRO forwarding for better throughput

When running as an exit node or subnet router, Tailscale may warn about suboptimal UDP GRO forwarding.
This [optimization](https://tailscale.com/s/ethtool-config-udp-gro) improves UDP throughput on Linux 6.2+ kernels:

```fish
NETDEV=$(ip -o route get 8.8.8.8 | cut -f 5 -d " ")
sudo ethtool -K $NETDEV rx-udp-gro-forwarding on rx-gro-list off

systemctl is-enabled networkd-dispatcher
# enabled

printf '#!/bin/sh\n\nethtool -K %s rx-udp-gro-forwarding on rx-gro-list off \n' "$(ip -o route get 8.8.8.8 | cut -f 5 -d " ")" | sudo tee /etc/networkd-dispatcher/routable.d/50-tailscale

sudo chmod 755 /etc/networkd-dispatcher/routable.d/50-tailscale

sudo /etc/networkd-dispatcher/routable.d/50-tailscale

test $? -eq 0 || echo 'An error occurred.'
```
You should see no error messages.


## Lock down server with UFW (allow only Tailscale)

{{< callout note >}}
Before locking down the server, exit your current SSH session and reconnect using the Tailscale IP to ensure you won't lose access:

```
ssh username@100.x.y.z
ssh wmutschl@tailscale-name  # if using Tailscale's magic DNS
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

If you are running a website on this machine, one needs to allow port 80 and 443:

```fish
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
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
sudo apt install -y cryptsetup
sudo cryptsetup luksOpen /dev/sda crypt_backup1
sudo cryptsetup luksOpen /dev/sdb crypt_backup2
sudo cryptsetup luksOpen /dev/nvme0n1p4 crypt_docker
```

{{< callout note >}}
I use the same LUKS passphrase across all disks (matching the system disk), so at reboot I only enter it once and it's automatically passed to the other disks. Good to know :-)
{{< /callout >}}

Create mount points and set ownership:

```fish
sudo mkdir -p /btrfs_backup /btrfs_docker $HOME/docker $HOME/vm /var/lib/docker
sudo chown -R $USER:$USER $HOME/vm $HOME/docker
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


## Docker

### Installation and configuration

Follow the [official guide](https://docs.docker.com/engine/install/ubuntu/) to install Docker:

Remove any old versions

```fish
sudo apt remove $(dpkg --get-selections docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc | cut -f1)
```

Add Docker's official GPG key:

```fish
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

Add the repository to Apt sources (copy all files to last EOF):

```fish
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: amd64
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

Install the Docker packages:

```fish
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Add your user to the docker group

```fish
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker # or logout and login again
````

Enable and start Docker:

```fish
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
sudo systemctl start docker
sudo systemctl status docker
```

Verify Docker works without root (run as your normal user, not root):

```fish
docker run hello-world
# Hello from Docker!
# This message shows that your installation appears to be working correctly.
```

### Deploy Docker containers

I clone my [scripts](https://github.com/wmutschl/scripts) repository that contains my docker-compose files:

```fish
git clone git@github.com:wmutschl/scripts.git /home/$USER/scripts
cd /home/$USER/scripts
```

Next I need to configure the secrets:

```fish
cp simba.env .env
nano .env
```

Finally, I deploy the containers:

```fish
docker compose -f simba-docker-compose.yml pull
docker compose -f simba-docker-compose.yml up -d
```

Check logs:

```fish
docker compose -f simba-docker-compose.yml logs swag
docker compose -f simba-docker-compose.yml logs gitea
docker compose -f simba-docker-compose.yml logs mattermost
docker compose -f simba-docker-compose.yml logs mattermost-postgres
```

## BTRFS snapshots, backups, and maintenance

With all data stored on BTRFS, it's essential to configure automatic snapshots and backups for data protection.
I use BTRBK to manage snapshots and backups, along with maintenance scripts that handle BTRFS balance and scrub operations via cron jobs.
All configuration files and scripts are available in my [scripts](https://github.com/wmutschl/scripts) repository.

### BTRBK: automatic snapshots and backups

Begin by adding an entry to the fstab to mount the top-level BTRFS root to `/btrfs_pool`:

```fish
sudo nano /etc/fstab
# UUID=f18b85ef-a467-4664-8b59-2798c6ce80d3  /  btrfs  defaults,compress=zstd:1,subvol=@  0  0
# UUID=f18b85ef-a467-4664-8b59-2798c6ce80d3  /home  btrfs  defaults,compress=zstd:1,subvol=@home  0  0
# UUID=f18b85ef-a467-4664-8b59-2798c6ce80d3  /btrfs_pool  btrfs  defaults,compress=zstd:1,subvolid=5  0  0
```

Then mount the filesystem:

```fish
sudo mount -av
ls /btrfs_pool
# @/  @home/
```

Create a directory for the snapshots:

```fish
sudo mkdir -p /btrfs_pool/btrbk_snapshots
```

Next, install BTRBK:

```fish
sudo apt install btrbk
btrbk --version
# btrbk command line client, version 0.32.5
```

Test the BTRBK configuration with a dry run before executing the actual backup.
Running this in a screen session is recommended to preserve the output if the session is interrupted:

```fish
cd $HOME/scripts
screen # recommended to prevent losing output if the session is interrupted

sudo btrbk -c simba-btrbk.conf dryrun
sudo btrbk -c simba-btrbk.conf run -v --progress
```

Finally, I check whether the script which will be run by the cron job works:

```fish
cd $HOME/scripts
sudo sh btrfs-btrbk.sh
```

### Maintenance: btrfs balance and btrfs scrub

Verify that the BTRFS maintenance scripts execute properly:

```fish
cd $HOME/scripts
sudo sh btrfs-balance.sh # should complete quickly
sudo sh btrfs-scrub.sh   # may take several hours depending on disk size
```

### Automating with crontab

To automate all BTRFS operations, prepare the log folder and activate the prepared crontab configuration:

```fish
mkdir -p $HOME/logs
cd $HOME/scripts
sudo crontab simba-crontab.txt
```

Finally, review the crontab entries and update the healthchecks.io ping URL as needed:

```fish
sudo crontab -e
```


## GPG Agent Forwarding

To use my GPG keys stored on my Mac (YubiKey) remotely, I forward the GPG agent over SSH.
On the **Mac**, I create an entry in `~/.ssh/config` for the SSH connection using the Tailscale IP:
```
Host simba-tailscale
   User wmutschl
   HostName 100.105.169.114
   Port 22
   IdentityFile ~/.ssh/id_macbook
   RemoteForward /run/user/1000/gnupg/S.gpg-agent /Users/wmutschl/.gnupg/S.gpg-agent.extra
```
The important part is the `RemoteForward` line, which forwards the GPG agent over SSH.

On the **remote server**, we need to enable socket unlinking in `/etc/ssh/sshd_config`:

```fish
echo "StreamLocalBindUnlink yes" | sudo tee -a /etc/ssh/sshd_config
sudo systemctl enable ssh
sudo systemctl start ssh
```

Next, we install the necessary packages:

```fish
sudo apt install -y gpg scdaemon gnupg-agent pcscd gnupg2
```

Fetch my public key from GitHub:
```fish
cd $HOME/.gnupg
curl https://github.com/wmutschl.gpg > $HOME/.gnupg/public.asc
```

Import the public key and give it trust level 5:
```fish
gpg --import public.asc
export KEYID=91E724BF17A73F6D
gpg --edit-key $KEYID
  trust
  5
  y
  quit
```

Let's test this.
First, disconnect all connections to the server.
Second, **on the MAC** create an encrypted file and copy it to the server:

```fish
cd $HOME/.gnupg
export KEYID=91E724BF17A73F6D
echo "This is an encrypted message" | gpg --encrypt --armor --recipient $KEYID -o encrypted.txt # this should ask you for the pin of your YubiKey
gpg --decrypt --armor encrypted.txt
# gpg: encrypted with rsa4096 key, ID 16B5237D55638B96, created 2019-12-09
#       "Willi Mutschler <willi@mutschler.eu>"
# This is an encrypted message
scp encrypted.txt simba-tailscale:.gnupg/encrypted.txt
```


Third, reconnect using verbose mode to check whether the socket is forwarded correctly:
```fish
ssh simba-tailscale -v
# ...
# debug1: Remote connections from /run/user/1000/gnupg/S.gpg-agent:-2 forwarded to local address /Users/wmutschl/.gnupg/S.gpg-agent.extra:-2
# ...
# debug1: Remote: /home/wmutschl/.ssh/authorized_keys:1: key options: agent-forwarding port-forwarding pty user-rc x11-forwarding
# debug1: Remote: /home/wmutschl/.ssh/authorized_keys:1: key options: agent-forwarding port-forwarding pty user-rc x11-forwarding
# debug1: remote forward success for: listen /run/user/1000/gnupg/S.gpg-agent:-2, connect /Users/wmutschl/.gnupg/S.gpg-agent.extra:-2
# ...
```
If you see the above, then the socket is forwarded correctly.

Fourth, **on the server** decrypt the file:
```fish
gpg --decrypt --armor .gnupg/encrypted.txt # this should ask you for the pin of your YubiKey
# debug1: client_input_channel_open: ctype forwarded-streamlocal@openssh.com rchan 2 win 2097152 max 32768
# debug1: client_request_forwarded_streamlocal: request: /run/user/1000/gnupg/S.gpg-agent
# debug1: connect_next: start for host /Users/wmutschl/.gnupg/S.gpg-agent.extra ([unix]:/Users/wmutschl/.gnupg/S.gpg-agent.extra)
# debug1: connect_next: connect host /Users/wmutschl/.gnupg/S.gpg-agent.extra ([unix]:/Users/wmutschl/.gnupg/S.gpg-agent.extra) in progress, fd=7
# debug1: channel 1: new forwarded-streamlocal@openssh.com [forwarded-streamlocal] (inactive timeout: 0)
# debug1: confirm forwarded-streamlocal@openssh.com
# debug1: channel 1: connected to /Users/wmutschl/.gnupg/S.gpg-agent.extra port -2
# gpg: encrypted with rsa4096 key, ID 16B5237D55638B96, created 2019-12-09
#       "Willi Mutschler <willi@mutschler.eu>"
# gpg: problem with fast path key listing: Forbidden - ignored
# This is an encrypted message
```
If you see the content of the encrypted message, then everything is working correctly. Don't worry about the `fast path key listening` warning.

## Apps

### Fish - A Friendly Interactive Shell
I am using the Fish shell on all my systems, due to its [user-friendly features](https://fedoramagazine.org/fish-a-friendly-interactive-shell/), so I install it and make it my default shell:
```fish
sudo apt install -y fish
chsh -s /usr/bin/fish
```
You will need to log out and back in for this change to take effect.
Lastly, I want to add the `~/.local/bin` to my `$PATH` [persistently](https://github.com/fish-shell/fish-shell/issues/527) in Fish:
```fish
mkdir -p /home/$USER/.local/bin
set -Ua fish_user_paths /home/$USER/.local/bin
```

### git and git-lfs
I make sure git is installed and git-lfs is initialized:
```fish
sudo apt install -y git git-lfs
git-lfs install
```

### GitKraken
As a GUI for git, I use GitKraken:
```fish
cd Downloads
wget https://api.gitkraken.dev/releases/production/linux/x64/active/gitkraken-amd64.deb
sudo dpkg -i gitkraken-amd64.deb
```
Open it and set it up to your liking.

### Dynare related packages
I am a developer of [Dynare](https://www.dynare.org) and need these packages to compile it from source and run it optimally ob Ubuntu-based systems:
```fish
sudo apt install -y gcc g++ gfortran octave-dev libboost-graph-dev libgsl-dev libmatio-dev libslicot-dev libslicot-pic libsuitesparse-dev flex libfl-dev bison meson pkgconf texlive texlive-publishers texlive-latex-extra texlive-fonts-extra texlive-science lmodern cm-super python3-sphinx make tex-gyre latexmk libjs-mathjax x13as
```

### MATLAB
I have a license for MATLAB, so I download it from their website and run the installer after unzipping:
```
cd Downloads
unzip matlab_R2025b_Linux.zip -d matlab_installer
matlab_installer/install
```
Note that I install it into my home folder into `/home/$USER/MATLAB/R2025b`.
To have it working optimally, I also install the `matlab-support` package:

```fish
sudo apt install -y matlab-support
```

Finally, run MATLAB and change some settings:
- Editor/Debugger
  - MATLAB Language: add `mod` and `inc` to *File extensions*
  - Saving: Deactivate *Automatically create backup files while working in the MATLAB Editor*
- General
  - MAT and FIG Files: use *Version 7.3 or later*
- Keyboard
  - Shortcuts: *Windows*
- Source Control
  - Deactivate *Enable Source Control*
- MATLAB Copilot: Deactivate *Enable MATLAB Copilot*

### R
For teaching and data analysis there is nothing better than R. These are the packages I commonly use:
```fish
sudo apt install -y r-base r-base-dev libatlas3-base r-cran-rgl r-cran-foreign r-cran-mass r-cran-minqa r-cran-nloptr r-cran-rcpp r-cran-rcppeigen r-cran-lme4 r-cran-sparsem r-cran-matrix r-cran-matrixmodels r-cran-matrixstats r-cran-pbkrtest r-cran-quantreg r-cran-car r-cran-lmtest r-cran-sandwich r-cran-zoo r-cran-evaluate r-cran-digest r-cran-stringr r-cran-stringi r-cran-yaml r-cran-catools r-cran-bitops r-cran-jsonlite r-cran-base64enc r-cran-digest r-cran-rcpp r-cran-htmltools r-cran-catools r-cran-bitops r-cran-jsonlite r-cran-base64enc r-cran-rprojroot r-cran-markdown r-cran-ggplot2 r-cran-dplyr r-cran-hmisc r-cran-readr r-cran-readxl
```
I typically use Cursor (or VSCode) to remotely work with R on the server, so I don't need a GUI like RStudio (which I still highly recommend for local use).

### Quickemu
```fish
sudo apt install quickemu qemu-system-modules-spice
```

### Remote desktop
???


## Settings

Go through the settings:
