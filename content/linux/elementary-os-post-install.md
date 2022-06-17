---
title: 'elementary OS: Things to do after installation (Apps, Settings, and Tweaks)'
summary: In the following I will go through my post installation steps on elementary OS, i.e. which settings I choose and which apps I install and use.
header:
  image: "Elementary_OS_6.1.png"
  caption: "Image credit: [**VARGUX via Wikimedia Commons**](https://commons.wikimedia.org/wiki/File:Elementary_OS_6.1_-_Información_del_Sistema.png)"
tags: ["linux", "elementary-os", "install guide", "post-install"]
date: 2022-06-16
draft: false
type: book
---

***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev). Pull requests are very much appreciated***

<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

In the following I will go through my post installation steps, i.e. which settings I choose and which apps I install and use.

{{< toc hide_on="xl" >}}
## Basic Steps

### Go through System Settings

#### Desktop
- Choose a Wallpaper
- Choose Appearance
  - Default
  - Schedule 'Sunset to Sunrise'
  - Accent: Mint
- Text
  - Size 1.00
  - disable Dyslexia-friendly
- Dock & Panel
  - Icon size 'small'
  - Turn on Hide when 'Any window overlaps the dock'
  - Turn off Hide when 'Pressure reveal'
  - Turn on ' Panel translucency'
- Multitasking
  - Do nothing for the corners
  - Activate Move windows to a new workspace 'When entering fullscreen'
  - Deactivate Move windows to a new workspace 'When maximizing'
  - Activate 'Window animations'

#### Language & Region
For some reason elementary OS installs a bunch of languages which unnecessarily increases the system updates. So to speed this up, I remove all the languages that I do not need and keep only 'English' and 'German'. This takes some clicking and unfortunately the system settings don't show the progress until you re-open the settings dialog. At the end click 'Complete Installation' to install missing language support for the remaining languages. Re-open the dialog and change:

- Region: United States
- Formats: Germany
- Temperature: Celsius

Confirm with 'Set Language'. Open a terminal and update the locales:

```bash
sudo locale-gen de_DE.UTF.8
sudo locale-gen en_US.UTF.8
sudo update-locale LANG=en_US.UTF-8
```

#### Notifications
I leave everything turned on at the beginning and re-visit this settings panel for applications that bother me. Mostly I deactivate the 'Sounds' switch for those applications.

#### Security & Privacy
- History
  - I enable it and check all 'Data Sources'.
- Locking
  - Activate 'Lock on suspend'
  - Activate 'Lock after screen turns off'
  - Activate 'Forbid new USB devices when locked'
- Firewall
  - As this is a desktop computer, I do not need the Firewall or adapt any settings
- Housekeeping
  - 'Automatically Delete': 'Old temporary files' and 'Trashed files'
  - 'Delete Old Files After:' 30 days
- Location Services:
  - I enable this by default and re-visit this setting after installing other applications

#### Displays
I use a Thunderbolt Dock (either a DELL TB16 or a Anker PowerExpand Elite 13-in-1 or a builtin dock of my LG 38 curved monitor). Setting this up is sometimes a bit fiddly, so in this settings panel I try to arrange them correctly and check the 'Scaling factor'. I also activate 'Night Light' mode with 'Sunset to Sunrise'.

#### Keyboard
I change the behavior of the <kbd>SUPER</kbd> key to show the 'Multitasking View'. Then I go through the Shortcuts page. I typically try to use the distro's default shortcuts and change them only if I keep forgetting them or persistently use other shortcuts which are in my muscle memory.  I don't change the `Behavior` settings as they are fine with me.

#### Mouse & Touchpad
Go through the settings, but I usually stick to the defaults. For my external mouse I make sure that 'Natural Scrolling' is turned off, whereas for a Touchpad I like to turn it on.

#### Power
- Turn off display when inactive for: 15 min
- Power button: Prompt to shutdown
- Suspend when inactive for 30 min

#### Printers
My printer is connected to the network, so usually it is automatically detected.

#### Sound
- Deactivate 'Event alerts'

#### Wacom
I don't have a Wacom tablet.

#### Bluetooth
On my Desktop computer I typically deactivate Bluetooth unless I really need it. Sometimes deactivating it in the system settings does not work, but from the panel you can deactivate it just fine.

#### Network
Even though my computer is connected via LAN, I also enter my WiFi password.

#### Online Accounts
I add a CalDAV account pointing towards my Nextcloud.

#### Sharing
I typically don't use this feature and deactivate 'Media Library'.

#### Date & Time
- Time format: 24-hour
- Time zone: deactivate 'Based on location' and choose Europe-Berlin-Germany (most areas)
- Activate 'Network time'
- Deactivate 'Show week numbers'
- Show in Panel: 'Date', 'Day of the week

#### Screen Time & Limits
I don't use this feature.

#### System
Nothing to do here.

#### Universal Access
I don't use any features here.

#### User Accounts
I change my profile picture.

### Set hostname
When creating a user, you can also choose the name of your computer for better accessability on the network. If I forgot to do this, I change it with:
```bash
hostnamectl set-hostname green-lantern
```

## Install Required Drivers
Not all drivers are installed, particularly proprietary drivers Nvidia GPUs or special WiFi drivers need to be manually installed to get the maximum performance from your system:
```bash
sudo ubuntu-drivers autoinstall
```

## Install software-properties-common
In order to fully elementary OS I install software-properties-common, which allows to "easily manage your distribution and independent software vendor software sources":
```bash
sudo apt install software-properties-common
```
In essence this allows to make use of third-party apt repositories by providing the infamous `add-apt-repository` command.

## deb-get to install third-party software on Ubuntu easily
I am a fan of easy ways to install third-party software, Martin Wimpress has created a neat tool called [deb-get](https://github.com/wimpysworld/deb-get) which I use on Ubuntu-based systems such as elementary OS.
```bash
sudo apt install curl
curl -sL https://raw.githubusercontent.com/wimpysworld/deb-get/main/deb-get | sudo -E bash -s install deb-get
```

## Restore from Backup
I mount my luks encrypted backup storage drive and use e.g. `rsync -avup $BACKUP/Documents ~/`  to copy over my files and important configuration scripts. At the end I run
```bash
sudo chown -R $USER:$USER /home/$USER
```
to make sure the permissions are correctly set.

## Install updates and reboot
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
sudo deb-get update
sudo deb-get upgrade
sudo reboot now
```


## Browser
I mostly use the shipped browser; however, sometimes I do need Chrome, which can easily be installed via deb-get:

```bash
sudo deb-get install google-chrome-stable
```
and sync my Account, Settings and Extensions.


## Fish - A Friendly Interactive Shell
I am using the Fish shell on all my systems, due to its [user-friendly features](https://fedoramagazine.org/fish-a-friendly-interactive-shell/), so I install it and make it my default shell:
```bash
sudo apt install -y fish
chsh -s /usr/bin/fish
```
You will need to log out and back in for this change to take effect. Lastly, I want to add the ~/.local/bin to my $PATH [persistently](https://github.com/fish-shell/fish-shell/issues/527) in Fish:
```bash
mkdir -p /home/$USER/.local/bin
set -Ua fish_user_paths /home/$USER/.local/bin
```
Also I make sure that it is in my $PATH also on bash:
```bash
bash -c 'echo $PATH'
#/home/wmutschl/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```
If it isn't then I make the necessary changes in my `/home/$USER/.bashrc` file.


## SSH keys
If I want to create a new SSH key, I run e.g.:
```bash
ssh-keygen -t ed25519 -C "elementary-on-green-lantern"
```
Usually, however, I restore my `.ssh` folder from my backup. Either way, afterwards, one needs to add the file containing your key, usually `id_rsa` or `id_ed25519`, to the ssh-agent:
```bash
eval "$(ssh-agent -s)" #works in bash
eval (ssh-agent -c) #works in fish
ssh-add ~/.ssh/id_ed25519
```
Don't forget to add your public key to GitHub, Gitlab, Servers, etc.


## Apps

### Snap support
Enable snap support
```bash
sudo apt install snapd
```


### System utilities

#### Bitwarden
Bitwarden is my password manager of choice:
```bash
sudo deb-get install bitwarden
```

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


#### Quickemu
I used to set up KVM, Qemu, virt-manager and gnome-boxes as this is much faster as VirtualBox. However, I have found a much easier tool for most tasks: [quickemu](https://github.com/wmutschl/quickemu):
```bash
sudo deb-get quickemu
```


### Networking


#### Tailscale
I use [Tailscale](https://tailscale.com/kb/1187/install-ubuntu-2204/) on all my systems to be able to connect them via Wireguard wherever I am. It is extremely easy to install. I use deb-get:

```bash
sudo deb-get install tailscale
```
Connect your machine to your Tailscale network and authenticate in your browser:
```bash
sudo tailscale up
```
That's it, check your ip:
```
tailscale ip -4
```
I also chose (in the browser) to disable key expiry to prevent the need to periodically re-authenticate.

#### OpenSSH Server
I sometimes access my linux machine via ssh from other machines, for this I install the OpenSSH server:
```bash
sudo apt install openssh-server
```
Then I make some changes to 
```bash
sudo nano /etc/ssh/sshd_config
```
to disable password login, to allow for X11forwarding and permit root logins.

#### Nextcloud
I have all my files synced to my own Nextcloud server, so I need the sync client. deb-get has the newer version, so:
```bash
sudo deb-get install nextcloud-desktop
```
Open Nextcloud and set it up. Double check the options.



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
sudo deb-get install gitkraken
```
Open GitKraken and set up Accounts and Settings. 

You can also use the flatpak version of Gitkraken, but one needs to add the following Custom Terminal Command: `flatpak-spawn --host gnome-terminal %d`. 

#### MATLAB
I have a license for MATLAB, unzipping the installation files in the the Downloads folder and then run the installer:
```bash
./home/$USER/Downloads/matlab/install
```
Note that I do not use `sudo` but install MATLAB into my home folder into `/home/wmutschl/MATLAB/R2022a` and don't create symbolic links (as this will be later done by the `matlab-support` package).

Once the installation process finishes, install `matlab-support`:
```bash
sudo apt install matlab-support
```
Activate MATLAB and make sure to select `Yes` to `Rename MATLAB's GCC libraries` as these are typically older than the one's from the distribution.

I don't have the [shared resources-for-x11-graphics bug](https://de.mathworks.com/matlabcentral/answers/342906-could-not-initialize-shared-resources-for-x11graphicsdevice#answer_425485?s_tid=prof_contriblnk), if you do, follow the link for a solution.

Open matlab and I change some settings to use Windows type shortcuts on the Keyboard, add `mod` and `inc` files as supported extensions, and do not use MATLAB's source control capabilities.


#### Visual Studio Code
I have transitioned to do most of my coding in Visual Studio code:
```bash
sudo deb-get install code
```
I keep my profiles and extensions synced using GitHub.

### Text-processing

#### Latex related packages
I write all my papers and presentations with Latex using the very powerful [LaTeX Workshop Extension](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) for Visual Studio Code as an editor. So let's install all tex-related packages:
```bash
sudo apt install -y texlive texlive-font-utils texlive-pstricks-doc texlive-base texlive-formats-extra texlive-lang-german texlive-metapost texlive-publishers texlive-bibtex-extra texlive-latex-base texlive-metapost-doc texlive-publishers-doc texlive-binaries texlive-latex-base-doc texlive-science texlive-extra-utils texlive-latex-extra texlive-science-doc texlive-fonts-extra texlive-latex-extra-doc texlive-pictures texlive-xetex texlive-fonts-extra-doc texlive-latex-recommended texlive-pictures-doc texlive-fonts-recommended texlive-humanities texlive-lang-english texlive-latex-recommended-doc texlive-fonts-recommended-doc texlive-humanities-doc texlive-luatex texlive-pstricks perl-tk
```


#### Sejda PDF editor
Most of the times elementary OS's pdf viewer works just fine. As an alternative, I find Sejda as an easy, pleasant and productive PDF editor:
```bash
sudo deb-get install sejda-desktop
```
Open it and check it out. 


### Communication

#### Mattermost
Our Dynare team communication is happening via Mattermost. Mattermost can be installed via snap, flatpak or deb-get:
```bash
sudo deb-get install mattermost-desktop
```
Open mattermost and connect to server.

#### Skype
Skype can be installed either via snap, flatpak or deb-get:
```bash
sudo deb-get install skypeforlinux
```
Open skype, log in and set up audio and video.

#### Zoom
Zoom can be installed either via snap, flatpak or deb-get:
```bash
sudo deb-get install zoom
```
Open zoom, log in and set up audio and video.


### Multimedia

#### Multimedia Codecs
Install and compile multimedia codecs:
```bash
sudo apt install -y ubuntu-restricted-extras libavcodec-extra libdvd-pkg
sudo dpkg-reconfigure libdvd-pkg
```

#### VLC 
Still one of the best video players:
```bash
sudo apt install -y vlc
```
Open it and check whether it works.

#### OBS
To get a full-loaded OBS Studio version I install it with either deb-get: 
```bash
sudo deb-get install obs-studio
```
Open OBS and set it up, import your scenes, etc. The snap version works also fine for me.




## Misc tweaks and settings

#### Reorder Favorites on Dock
I like to reorder the favorites on the dock and add additional ones.

#### Go through all programs
Go through all programs, decide whether you need them or uninstall these.

#### Deactivate GRUB timeout
If you don't want to see the GRUB menu, then change `GRUB_TIMEOUT=0` in `/etc/default/grub`. You need to run `sudo update-grub` afterwards. I typically set `GRUB_TIMEOUT=3`.

#### Enable tray icons for third-party apps

Some/Most apps use outdated/different code for their tray icons and this code is not compatible with elementary OS, so one has no tray icons (top right) for these apps. To fix this incompatibility there are different approaches, I still have to find one that works easy and reliable. Please let me know which one you are using (e.g. [old panel indicator approach](https://gist.github.com/isneezy/ee88f7702368e064021d884f0e98ec85#tweaking-the-ui))?

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
# Firmware version:
# Form factor:
# Enabled USB interfaces: OTP+FIDO+CCID
# NFC interface is enabled.
# 
# Applications	USB    	NFC     
# OTP     	Enabled	Enabled 	
# FIDO U2F	Enabled	Enabled 	
# OpenPGP 	Enabled	Enabled 	
# PIV     	Enabled	Enabled
# OATH    	Enabled	Enabled 	
# FIDO2   	Enabled	Enabled 	

sudo apt install -y libpam-u2f # second-factor for sudo commands
sudo apt install -y yubikey-luks  # second-factor for luks
sudo apt install -y gpg scdaemon gnupg-agent pcscd gnupg2 # stuff for GPG
```

Make sure that OpenPGP and PIV are enabled on both Yubikeys as shown above.

#### Yubikey: private GPG key
Let's use the private GPG key on the Yubikey (a tutorial on how to put it there is taken from [Heise](https://www.heise.de/ratgeber/FIDO2-YubiKey-als-OpenPGP-Smartcard-einsetzen-4590032.html), [YubiKey-Guide](https://github.com/drduh/YubiKey-Guide)) and particularly [Developer's Guide to GPG](https://developer.okta.com/blog/2021/07/07/developers-guide-to-gpg).
First, enable and start `pcscd`:
```bash
sudo systemctl enable pcscd
sudo systemctl start pcscd
```
My public key is available on [GitHub](https://github.com/wmutschl.gpg) and this URL is also specified on my Yubikey, so I can simply fetch that. Insert the Yubikey and then:
```bash
gpg --card-status
# If this did not find your Yubikey, then try to first reboot or look into the above references.
cd ~/.gnupg
gpg --edit-card
gpg/card> fetch
gpg/card> quit
```
Write down your keyid and export this into an environmental variable (this will always be the same):
```bash
export KEYID=91E724BF17A73F6D
gpg --edit-key $KEYID
  trust
  5
  y
  quit
echo "This is an encrypted message" | gpg --encrypt --armor --recipient $KEYID -o encrypted.txt
gpg --decrypt --armor encrypted.txt
# gpg: encrypted with 4096-bit RSA key, ID XYZ, create 2019-12-09
#        "Willi Mutschler <willi@mutschler.eu>"
# This is encrypted
```
If this did not trigger to enter the Personal Key on your Yubikey, then try to run `echo 'reader-port Yubico YubiKey' >> ~/.gnupg/scdaemon.conf`, reboot and try again. Also check the above references and enable pcscd.

#### Yubikey: two-factor authentication for admin/sudo password
Let's set up the Yubikeys as second-factor for everything related to sudo using the common-auth pam.d module:
```bash
pamu2fcfg > ~/u2f_keys
```
When your device begins flashing, touch the metal contact to confirm the association. You might need to insert a user pin as well. Do the same with your backup device:
```bash
pamu2fcfg -n >> ~/u2f_keys
```
Now move the file into /etc:
```bash
sudo mv ~/u2f_keys /etc/u2f_keys
```
and make this a required action for `common-auth`:
```bash
echo "auth    required                        pam_u2f.so nouserok authfile=/etc/u2f_keys cue" | sudo tee -a /etc/pam.d/common-auth
```
Before you close the terminal, open a new one and check whether you can do `sudo echo test` and are required to touch your Yubikey. You can always deactivate this feature by commenting out the above line in `/etc/pam.d/common-auth`. 

#### Yubikey: two-factor authentication for luks partitions
Let's set up the Yubikeys as second-factor to unlock the luks partitions. If you have brand new keys, then create a new key on them (BE CAREFUL DON'T OVERWRITE IF YOU HAVE ALREADY DONE THIS):
```bash 
ykpersonalize -2 -ochal-resp -ochal-hmac -ohmac-lt64 -oserial-api-visible #
```

First, I create an environmental variable to point towards my luks drive quickly (I installed on /dev/sdb3):
```bash
export LUKSDRIVE=/dev/sdb3
```
Next enroll both Yubikeys to the luks partition. Insert the first Yubikey and type:
```bash
sudo yubikey-luks-enroll -d $LUKSDRIVE -s 7
```
Insert the second Yubikey:
```bash
sudo yubikey-luks-enroll -d $LUKSDRIVE -s 8
```
Activate the keyscript in your crypttab:
```bash
export CRYPTKEY="luks,keyscript=/usr/share/yubikey-luks/ykluks-keyscript"
sudo sed -i "s|luks|$CRYPTKEY|" /etc/crypttab
```
Your crypttab should look similar to this:
```bash
cat /etc/crypttab
# data UUID=aa371a41-81f4-4f12-800e-8830a9afa8c8 none luks,keyscript=/usr/share/yubikey-luks/ykluks-keyscript,discard
```
Lastly, update the initramfs:
```bash
sudo update-initramfs -u -k all
# update-initramfs: Generating /boot/initrd.img-5.13.0-51-generic
# I: The initramfs will attempt to resume from /dev/dm-2
# I: (/dev/mapper/data-swap)
# I: Set the RESUME variable to override this.
# update-initramfs: Generating /boot/initrd.img-5.13.0-43-generic
# I: The initramfs will attempt to resume from /dev/dm-2
# I: (/dev/mapper/data-swap)
# I: Set the RESUME variable to override this.
```
Reboot and check whether the prompt has changed to "Please insert yubikey and press enter or enter a valid passphrase". So I typically do two reboots to check whether I can either use your Yubikey (with the new passphrase you selected above) or the original luks passphrase. 

If you want to deactivate this feature, remove the crypttab entry and update the initramfs.

## To Do

- Best way to disable single click?
- Best way to add tray icons? for
  - [ ] mattermost
  - [ ] skype
  - [ ] zoom
  - [ ] nextcloud
