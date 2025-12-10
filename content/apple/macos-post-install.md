---
title: 'macOS: Things to do after installation (Apps, Settings, and Tweaks)'
summary: In the following I will go through my post installation steps on macOS Sequoia, i.e. which settings I choose and which apps I install and use.
header:
  image: "DeskSetup.jpg"
  caption: "Image credit: [**Willi Mutschler**](https://mutschler.dev)"
tags: ["apple", "macos", "post-installation"]
date: 2025-03-14
type: book
---

***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev). Pull requests are very much appreciated.***
<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
{{< toc hide_on="xl" >}}

Since January 2021 I've been using an Apple MacBook Air (M1), then switched to a MacBook Pro M2 Max as my daily driver and a Apple Mac Mini M4 Pro as a runner for my research.
Even though I have a strong Linux background, I do like macOS quite a lot.
Particularly, one of the great things about macOS is the huge amount of useful and well-designed apps, tools and utilities; not only from the App Store but also by side-loading.
Therefore, in the following I will go through my post installation steps, i.e. which apps I install and use and which system preferences I choose.
In other words, this guide serves as a guide for me how I set up a macOS system.

### Beware of the costs
As we all know, not only Apple hardware but also software for macOScomes at a hefty premium.
I've tried to write down how much I've spent on apps and subscriptions since I started my macOS journey in January 2021, and I've documented that below for each app.
This doesn't include the applications and subscriptions I tested and discarded, so there is probably a significant sunk costs as well.
On the other hand, some apps are universal and I have bought them before on my iPhone or iPad.
Moreover, some subscriptions are covered by my university.
Anyways, pay attention to the cost if you decide to use Apple's eco system.

## Basic steps
Do the initial macOS setup and sign in to your Apple ID.
For me this required inserting my Security Key (Yubikey) which was not accepted directls due to some unknown error.
So I skipped the step and signed up again via system settings, which worked without any issues.
You will get several notifications for Apple apps trying to access your data which you need to approve.

### Connect devices
After doing the initial steps, I connect my peripherals and check whether they work.

### Arrange displays and change desktop backgrounds
Go to `Displays` in `System Preferences` and arrange the displays.
I also choose different backgrounds for each monitor.

### Install Software Update for macOS
Before I proceed, I see whether a new version of macOS is available.
Go to System Settings, General, and Software Update.
This takes a while and requires a reboot.

### Restore files either via Time Machine, Nextcloud or rsync
The easiest way to restore everything is to use the migration assistant, but typically I only need to restore some folders and files from my Time Machine backups (or alternatively sync from my Nextcloud server or use `rsync -avuP /Volumes/T5/Documents/ /Users/wmutschl/Documents/).
For Time Machine, click on the red exclamation mark and "Claim existing backups".
I then do a full backup and activate both automatic backups as well as displaying it in the menu bar.
After the first backup, you can either use Time Machine directly to restore certain folders and files or, alternatively, open the disk in finder, select the most recent snapshot and simply copy the files and folders over.

I add several folders to the exclude list, note that I do this in Terminal.app for convenience, but you can also do this via the Time Machine settings:
```sh
sudo tmutil addexclusion -p $HOME/FinalCutRaw
sudo tmutil addexclusion -p $HOME/Movies
sudo tmutil addexclusion -p $HOME/Music/Music
sudo tmutil addexclusion -p $HOME/Virtual Machines.localized
```

### Enable internet accounts for calendar, contacts and mails
In `Internet Accounts` of `System Settings` I enable and set up my accounts for mails, calendars and contacts:
- iCloud
- mutschler.eu (imap/smtp)
- mutschler.dev (imap/smtp)
- dynare.org (imap/smtp)
- University Tübingen (Exchange)
- Microsoft 365 account (Exchange)

What about my profile to sign stuff?

### Finder Preferences
I change some preferences in Finder for my convenience.
So open a Finder windows and go to `Finder` -> `Preferences` and change the following:
- `General`
  - Turn off all things under *Show these items on the desktop*
  - *New Finder windows show* `wmutschl` (my user name)
  - Deactivate *Sync Desktop & Documents folders*
  - Activate *Open folders in tabs instead of windows*
- `Tags`: nothing to change here
- `Sidebar`
  - I like to show the following items under *Favorites*: Desktop, Documents, Downloads, wmutschl, Applications,iCloud Drive, Shared, Hard disks, External disks, CDs, Cloud Storage, Bonjour computers, Connected servers
- `Advanced`
  - Activate *Show all filename extensions*
  - Deactivate *Show warning before changing an extension*
  - Deactivate *Show warning before removing from iCloud Drive*
  - Deactivate *Show warning before emptying the Trash*
  - Activate *Remove items from the Bin after 30 days*
  - Activate `Keep folders on top` for *In windows when sorting by name*
  - Activate `Keep folders on top` for *On Desktop*
  - Change `When performing a search:` to *Search the Current Folder*

Next got to `View` and change the following:
- Activate `Show Path Bar`

Lastly, I change the default view.
For this go to `View` - `Show View Options` and change the following:
- Click <kbd>CMD</kbd>+<kbd>2</kbd> and then select the layout I want by default (e.g. *Show Library Folder*)
- Hit `Use As Defaults` at the bottom.

## Browsers and extensions

### Safari
My daily driver for surfing the web is Safari, so I go through the preferences and set it up to my liking.
I make the following changes:
- `General`
  - Deactivate *Open "safe" files after downloading*
- `Search`
  - Deactivate *Enable Quick Website Search*
  - Deactivate *Preload Top Hit in the background*
- `Privacy`
  - Activate *Require password to view locked tabs*
- `Advanced`
  - Activate *Show full website address*

I also activate the `Show Favorites Bar` under View.

Lastly, I install the following extensions via the App Store:
- [1Blocker (1.99€/month)](https://apps.apple.com/us/app/1blocker-ad-blocker-privacy/id1365531024):
In the extensions panel of the Safari preferences I enable all 1Blocker extensions and then set up the app to my liking.
Actually, if you have it already installed on another machine, the settings will be synced to the new machine.

### Chrome
For YouTube and some websites that do not work under Safari, I also install [Google Chrome](https://www.google.com/chrome/).
I don't make it my default browser, but do sign in to my Google account to sync my settings and extensions.
I don't use any extensions on Chrome.
I also deactivate the *Show warning before quitting with <kbd>CMD</kbd>+<kbd>Q</kbd>* option.

### Mail
I then open the Mail app to sync my emails.
While it syncs, I go through the preferences and make the following changes:
- `General`
  - New messages sound: *None*
  - Deactivate *Play sounds for other mail actions*
  - Deactivate *Follow Up Suggestions*
- `Accounts`
  - Check the folders in `Mailbox Behaviors` and the `Server Settings` for each account
- `Composing`
  - Deactivate *Add link previews*

I also deactivate "Organise by Conversation" in View for **every Folder** in **every Mail Account** (sic!).
Lastly, I make sure that my S/MIME certificate is working (if not, [follow these steps](https://support.apple.com/en-gb/guide/mail/mlhlp1179/16.0/mac/15.0)) and also import your private key to the Key Chain.

## Xcode Command Line Tools
`Command Line Tools for Xcode` (like git, rsync, compilers) are important for coding and development, they can be installed by entering the following command in the terminal:
```sh
xcode-select --install
```

## Rosetta 2
Unfortunately, some software I use is still (and probably will never) be ported to Apple Silicon (ARM), so I make sure to install the Intel compatibility layer [Rosetta 2](https://support.apple.com/en-us/HT211861):
```sh
softwareupdate --install-rosetta --agree-to-license
```
Note that this needs to be done only once and often this is already triggered if you already installed an Intel version of a software.

## Terminal

### Homebrew with aliases for both Intel and ARM versions
Homebrew is the [missing package manager for macOS](https://brew.sh) which allows one to install all sorts of software and tools I need for my work.
I need to make sure that I have both the Intel as well as ARM version of homebrew installed.
So open terminal.app and install the ARM version of homebrew first:
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
(echo; echo 'eval "$(/opt/homebrew/bin/brew shellenv)"') >> /Users/wmutschl/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```
This installs Homebrew into `/opt/homebrew`.
Next, I install the Intel version using the `arch -x86_64` prefix:
```sh
arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
This install Homebrew into `/usr/local/homebrew`.
Don't run the "Next steps" as by default the ARM version should be used.
Now let's create two useful aliases for both versions:
```sh
echo 'alias mbrew="/opt/homebrew/bin/brew"' >> /Users/wmutschl/.zshrc
echo 'alias ibrew="arch -x86_64 /usr/local/bin/brew"' >> /Users/wmutschl/.zshrc
```
Close and re-open your terminal and test these by e.g. running update and upgrade commands:
```sh
mbrew update && mbrew upgrade
ibrew update && ibrew upgrade
brew update && brew upgrade
```
Note that `brew` command refers to the ARM version, which is the right default for me.

### Fish (A Friendly Interactive Shell)
Instead of Apples default `zsh` shell, I like to use [Fish shell](https://fishshell.com) as it is much more [interactive and user-friendly](https://fedoramagazine.org/fish-a-friendly-interactive-shell/).
This can be installed easily with (ARM) homebrew:
```sh
brew install fish
```
To make fish the default shell one needs to first include it into `/etc/shells`:
```sh
echo "/opt/homebrew/bin/fish" | sudo tee -a /etc/shells
cat /etc/shells
# /opt/homebrew/bin/fish
```
And then change the shell:
```sh
chsh -s /opt/homebrew/bin/fish
```
Close the Terminal.app and re-open another Terminal.app and you should be greeted by Fish.

Lastly, I make sure that `/opt/homebrew/bin` is in my `fish_user_paths`:
```sh
set -U fish_user_paths /opt/homebrew/bin $fish_user_paths
```
And I create aliases for ARM Homebrew and Intel Homebrew in Fish as well:
```sh
alias mbrew "/opt/homebrew/bin/brew"
funcsave mbrew

alias ibrew "arch -x86_64 /usr/local/bin/brew"
funcsave ibrew
```

### .local/bin in $PATH
I like to have `$HOME/.local/bin` in my $PATH.
In Fish one can do this using the following command:
```sh
mkdir -p $HOME/.local/bin
set -Ua fish_user_paths $HOME/.local/bin
```
zsh and bash usually pick this up, once the folder is created.
You can check this by opening another Terminal.app and running
```sh
bash -C "echo $PATH"
zsh -c "echo $PATH"
```

### Dracula Theme for Terminal
I like the [Dracula Theme] for the Terminal, which can be easily installed using Homebrew:
```
brew tap dracula/install
brew install --cask dracula-terminal
```
To activate the theme go to Settings of Terminal.app, go to profiles, click the Circle with the three dots and *Import*. 
Then use <kbd>CMD</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> to input the path `/opt/homebrew/` and then go to `Caskroom/dracula-terminal/VERSION/terminal-app-master`.
Finally, select the Dracula.terminal file and click *Default*.

### perl: warning: Setting locale failed on servers
I sometimes get a warning "perl: warning: Setting locale failed." when I connect to my servers.
A quick fix is the following:
- Open Terminal -> Preferences -> Profiles -> Advanced tab -> uncheck `Set locale environment variables on startup`.

## SSH keys
If I want to create a new SSH key, I run in Terminal.app:
```sh
ssh-keygen -t ed25519 -C "Mac"
```
Usually, however, I restore my `.ssh` folder from my backup (see above).
Either way, afterwards, one needs to add the file containing your key, usually `id_rsa` or `id_ed25519`, to the ssh-agent.
First start the ssh-agent in the background:
```sh
eval "$(ssh-agent -s)" # works in bash or zsh
eval (ssh-agent -c)    # works in fish
```
Next, we need to modify `~/.ssh/config` file to automatically load keys into the ssh-agent and store passphrases in the keychain.
As I restore from backup, I don't have to do this step.
But for completeness, if the file does not exist yet, create and open it:
```sh
touch ~/.ssh/config
nano ~/.ssh/config
```
Make sure that it includes the following lines:
```sh
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```
If your SSH key file has a different name or path than the example code, modify the filename or path to match your current setup.
Note that if you don't have a passphrase to your key, you should omit the *UseKeychain* line.
Lastly, let's add our private SSH key to the ssh-agent:
```sh
ssh-add -K ~/.ssh/id_ed25519
```
Don't forget to add your public key to GitHub, Gitlab, servers, etc.

## Private GPG key with Yubikey
I store my private GPG key on two Yubikeys (a tutorial on how to put it there is taken from [Heise](https://www.heise.de/ratgeber/FIDO2-YubiKey-als-OpenPGP-Smartcard-einsetzen-4590032.html) or [YubiKey-Guide](https://github.com/drduh/YubiKey-Guide)).
For this I need to install several packages via ARM Homebrew first
```sh
brew install gnupg pinentry-mac yubikey-personalization ykman
```
Make sure that the `.gnupg` folder has the correct permissions:
```sh
mkdir -p ~/.gnupg
chmod 700 ~/.gnupg
find ~/.gnupg -type f -exec chmod 600 {} \;
find ~/.gnupg -type d -exec chmod 700 {} \;
```
Now insert the first Yubikey and check whether it is recognized:
```sh
ykman info # your key should be recognized
# Device type: YubiKey 5C NFC
# Serial number: 19926994
# Firmware version: 5.4.3
# Form factor: Keychain (USB-C)
# Enabled USB interfaces: OTP, FIDO, CCID
# NFC transport is enabled
# 
# Applications	USB    	NFC    
# Yubico OTP  	Enabled	Enabled
# FIDO U2F    	Enabled	Enabled
# FIDO2       	Enabled	Enabled
# OATH        	Enabled	Enabled
# PIV         	Enabled	Enabled
# OpenPGP     	Enabled	Enabled
# YubiHSM Auth	Enabled	Enabled
```
Do the same for the backup Yubikey.
Make sure that OpenPGP and PIV are enabled on both Yubikeys as shown above.
Next, check whether the GPG card on both Yubikeys is readable by gpg:
```sh
gpg --card-status
# gpg: keybox '/Users/wmutschl/.gnupg/pubring.kbx' created
# Reader ...........: Yubico YubiKey OTP FIDO CCID
# Application ID ...: D2760001240100000006199269940000
# Application type .: OpenPGP
# Version ..........: 3.4
# Manufacturer .....: Yubico
# Serial number ....: 19926994
# Name of cardholder: Willi Mutschler
# Language prefs ...: en
# Salutation .......: 
# URL of public key : https://github.com/wmutschl.gpg
# Login data .......: wmutschl
# Signature PIN ....: not forced
# Key attributes ...: rsa4096 rsa4096 rsa4096
# Max. PIN lengths .: 127 127 127
# PIN retry counter : 3 0 3
# Signature counter : 884
# KDF setting ......: off
# UIF setting ......: Sign=off Decrypt=off Auth=off
# Signature key ....: C13E 5D55 8A9F 4AFE AE08  6186 91E7 24BF 17A7 3F6D
#     created ....: 2019-12-09 08:36:41
# Encryption key....: 5D12 A11E 39A6 1ED2 E0F9  9F23 16B5 237D 5563 8B96
#       created ....: 2019-12-09 08:36:41
# Authentication key: E1B6 6FC6 852C 0FC1 9917  D825 8CFE 5D68 CC28 71C3
#       created ....: 2019-12-09 08:38:21
# General key info..: [none]
```
My public key is stored in a file `$HOME/.gnupg/public.asc` which I either copy from backup or download from GitHub:
```
curl https://github.com/wmutschl.gpg > $HOME/.gnupg/public.asc
```
Next I import it and give it trust level 5:
```sh
cd ~/.gnupg
gpg --import public.asc
export KEYID=91E724BF17A73F6D
gpg --edit-key $KEYID
  trust
  5
  y
  quit
```
Let's test this:
```
echo "This is an encrypted message" | gpg --encrypt --armor --recipient $KEYID -o encrypted_MAC.txt
gpg --decrypt --armor encrypted_MAC.txt
```
This should ask you for the User Pin and you should be able to decrypt the message.

### GPG agent configuration
I make the following changes to my GPG agent configuration:
```sh
nano ~/.gnupg/gpg-agent.conf
# use-standard-socket
# pinentry-program /opt/homebrew/bin/pinentry-mac
```

### GPG agent forwarding
To use my GPG keys on my servers via forwarding the Yubikeys, I follow [this guide](https://gist.github.com/TimJDFletcher/85fafd023c81aabfad57454111c1564d).
Particularly, I add `StreamLocalBindUnlink yes` to `sshd_config` and run `gpgconf --create-socketdir` on the remote server.

My `$HOME/.gnupg/gpg-agent.conf` is:
```
use-standard-socket
pinentry-program /opt/homebrew/bin/pinentry-mac
#extra-socket $HOME/.gnupg/S.gpg-agent.extra
```
And I add `    RemoteForward /home/<user>/.gnupg/S.gpg-agent /Users/<user>/.gnupg/S.gpg-agent.extra` to each entry in my `.ssh/config` file.

Test it:
```
echo "test" | gpg --encrypt -r $MYKEYID > output
gpg --decrypt output

scp output remote-server:
ssh remote-server
gpg --decrypt output
```

## Apple Apps
Before I install additional apps, I go through all the applications Apple ships by default in order to provide the necessary permissions and change some settings.
So I click on all the apps in Launchpad and first delete all the apps that I don't use.
Then I make changes to some app settings, which I list below.

### App Store
Turn off everyhing. As for Updates, I usually do manual updates once a week to not miss new features.

### Calendar
Check whether all calendars are correctly synced and set the default calendar and notification times.
Turn off *Show shared calendar messages in Notification Center* under `Alerts`.
Turn on *Show events in year view* under `Advanced`.

### Contacts
Check whether all contacts are correctly synced and sort by first name.
Adjust the Default Account.
Under `General` I *Sort By*: *First Name* and the *Addres Format* to *Germany*.

### FaceTime
Make sure the Account is enabled and the numbers to be reached by are checked.
Deactivate "Automatic Camera Selection" under Video.

### Home
Make sure you have access to your Home.

### Keynote, Numbers, Pages
Deactivate "Correct spelling automatically" and "Capitalise words automatically".

### Messages
First, sign in to iMessage and then set up *Name and Photo* or make sure it is in sync.
Second, turn on *Enable Messages in iCloud* and *Send read receipts*.
Also make sure that messages are kept forever.

### Music
Turn on Lossless audio.

### Notes
Set the Default account; do not Enable the On My Mac account.

### Photo Booth
Deactivate "Automatic Camera Selection" under Camera.

### Photos
Go to preferences and check the following:
- `General`:
  - Privacy: activate *Use Password*
  - Photos: deactivate *Autoplay Videos and Live Photos*
  - Memories: activate all
  - Importing: activate *Copy items to the Photos library*
  - Sharing: activate *Include location information and set *Memories* to *Landscape* and *16:9*
  - Search: activate *Enhanced Visual Search*
- `iCloud`:
  - activate *icloud Photos* and *Download Originals to this Mac*. If you don't have the space, set it to *Optimize Mac Storage*.
  - activate *Shared Albums*
- `Shared Library`: I currently don't use this feature.

### Podcasts
I don't use this app, so turn Automatic Download Off.

### Reminders
Check the Default List.

### Shortcuts
If you need it: Activate *Allow Running Scripts* under `Advanced`.

### Text Edit
Deactivate "Correct spelling automatically"

### TV
Deactivate *Play Next Episode* and *Play a Recommendation* under `Auto Play`.
Turn on *Automatically delete watched movies and TV shows* under `Files`.

### Weather
Enable notifications for "Severe Weather" and "Next-hour Precipitation"

### Utilites - Digital Colour Meter
Select *Hexadecimal* under `View - Display Values`.

### Utilities - Disk Utility
In the view menu I select to `Show all devices` and `Show APFS Snapshots`.

### Keychain Access
Make sure my personal certificate is used for the correct emails and the private key is added.


## Productivity and Utilities Apps

### Amphetamine (free)
A little helper in case my MacBook needs to stay up all night.
It can be installed from the App Store.
Start the app and follow the instructions on the welcome screen.
I usually activate to *Launch Amphetamine at login* under `General` and change the *Menu Bar Image* to something else than the pill.

### Dockey (free) or manual configuration of Dock
This neat little app makes the Dock behave as I like.
[Download](https://dockey.publicspace.co) it and move it manually to the Applications folder.
I choose the following preferences:
- Auto-Hide Dock: Hide
- Animation Delay: Little
- Animation Speed: Fast
Alternatively, one can simply use the following terminal commands to achieve the same:
```sh
defaults write com.apple.dock autohide -bool true
defaults write com.apple.dock autohide-delay -float 0.15
defaults write com.apple.dock autohide-time-modifier -float 0.15
defaults write com.apple.dock largesize -int 71
defaults write com.apple.dock magnification -bool true
defaults write com.apple.dock minimize-to-application -bool true
defaults write com.apple.dock orientation -string bottom
defaults write com.apple.dock no-bouncing -bool false
killall Dock
```

Apps that I keep in my dock:
- Finder
- Safari
- Messages
- Mail
- Calendar
- Things
- Terminal
- Cursor
- ChatGPT
- GitKraken
- Zotero
- Mattermost
- NoMachine
- Screen Sharing
- MATLAB (previous version)
- MATLAB (newest version)

### Logi Options+ (free)
Install the software and follow the onboarding screen to allow some permissions in `Security & Privacy`, i.e. `Accessibility`,  `Bluetooth` and `Input Monitoring`.
For each device I restore my settings from the Online Backup.

### Mission Control Plus (9.65€)
From Gnome I am used to be able to close the windows from the activity overview, which is called mission control on macOS.
So I download [Mission Control plus](https://www.fadel.io/missioncontrolplus) for which I already purchased a license.
Unzip it and manually move it to the applications folder.
Open the app and follow the instructions.
Then enter the license in the menu bar and I choose to hide the menu icon.

### Moom (9.99€)
There are many options for tiling windows on macOS.
I find Moom quite flexible and install it via its [website](https://manytricks.com/moom/).
I choose to run it as a menu bar application and open at startup.
I also add a keyboard shortcut <kbd>CTRL</kbd>+<kbd>space</kbd> and add layouts I use often to shortcuts.
Once I have a working configuration I backup the settings by running in terminal.app:
```sh
defaults export com.manytricks.Moom /Users/wmutschl/Library/Mobile\ Documents/com\~apple\~CloudDocs/Moom.plist
```
So when I re-install Moom I can simply restore my settings by running the following command on the new machine in terminal.app:
```sh
defaults import com.manytricks.Moom /Users/wmutschl/Library/Mobile\ Documents/com\~apple\~CloudDocs/Moom.plist
```
Note that I have bought the license and keep the license file in Documents, so I can re-use it.

### Money Money (29.99€)
I really like this tool for my banking so I purchased a license.
Download the software from the [App Store](https://apps.apple.com/de/app/moneymoney/id872698314?mt=12) and open it.
Immediately in the menu bar I select `Help`-`Show database in Finder`.
Close Money Money completely (<kbd>CMD</kbd>+<kbd>q</kbd>).
Then I delete the three folders `Database`, `Extensions` and `Statements` and restore them from my backup.
Restart Money Money, enter your database password and license.
Then I go through the settings.

### Nextcloud (free)
I have all my user files synced to my own Nextcloud server, see my [backup strategy](../../linux/backup), so I need the sync client, which can be [downloaded](https://nextcloud.com/install/#install-clients).
Open nextcloud.app and set up the server and a first folder sync.
After the first sync, I need to recheck the options and particularly launch the app on System startup, deactivate the 500 MB limit and edit the ignored files.
Usually, I don't sync hidden files and add `*.photoslibrary`, `*.fcpbundle` and `*.musiclibrary` to the ignored files list only.
Again make sure to adjust settings after the first folder sync, because otherwise the Global Ignore Settings cannot be adjusted.

### Things 3 (49.99€)
My favorite To-Do app, which I've bought for all my devices.
Download from the [App Store](https://apps.apple.com/de/app/things-3/id904280696?mt=12), start it and enable Things Cloud.
This syncs my to-do's between my devices.
I then go through the preferences and adjust to my liking.

### EARLY (previously Timeular) (89€)
I've purchased a [Timeular Tracker](https://timeular.com/tracker/) in 2021, which came with the [Basic plan](https://timeular.com/pricing/) for free.
Now, the tracker is cheaper (69€), but the basic plan is not included anymore and costs 5€/month.
So I am quite happy with my deal.
Anyways, I install the app from the [website](https://timeular.com/download/), start it and sign in.
This syncs my data and settings.

## Networking and Virtualization

### Tailscale (free)
This is an amazing piece of software based on wireguard to connect all my devices no matter where I am at or if there are firewalls between the devices.
It creates a Mesh network and I can access securely all my mobile devices, computers and servers without exposing them to the internet.
Tailscale can be downloaded from the App Store, but comes with some limitations, so it is recommended to download it from [Tailscale.com](https://tailscale.com/download).
Open the app and select to auto start on login.
The app resides as a tray icon, which you can click to sign in to your account, change some settings and easily access the IP addresses of the different machines.

### NoMachine
I use [NoMachine](https://www.nomachine.com) on servers that have a desktop environment.
So I download the client, install it, open it and change the settings; particularly, deactivating "Start the server at system startup" and "Shut down the Server".
Using the [Tailscale](#tailscale-free) IPs I can then connect to my servers.

### VMWare Fusion (free)
This is a powerful and user-friendly piece of software to run virtual machines (VM).
Particularly, I like to try out Linux ARM VM's, Raspberry Pi Images, or macOS clean installs to test Dynare versions.
VMWare Fusion can be downloaded from their [website](https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion) after signing up.
After installation and activating the software I go through the settings.
If I have not done so already, I also create a clean macOS and Windows install for testing.
Note that all VMs will be installed into `~/Virtual Machines.localized`.
Obviously, I don't want the virtual machines in my Time Machine backups, so I exclude this folder in my Time Machine preferences.

### University VPN and eduroam (free)
To access the VPN of my university and connect to the [eduroam wifi network](https://eduroam.org), I need to install two profiles.
So first download these two files:

- [VPN profile](https://uni-tuebingen.de/fileadmin/Uni_Tuebingen/Einrichtungen/ZDV/Dokumente/Anleitungen/VPN/vpn-uni-tuebingen-2024.mobileconfig)
- [eduroam profile](https://uni-tuebingen.de/fileadmin/Uni_Tuebingen/Einrichtungen/ZDV/Dokumente/Anleitungen/eduroam/eduroam_2021.mobileconfig)

Then go to settings and install those profiles.
Afterwards one simply follows the [VPN guide](https://zdv-wiki.uni-tuebingen.de/display/CICS/VPN+Configuration+on+macOS) or the [eduroam guide](https://uni-tuebingen.de/en/einrichtungen/zentrum-fuer-datenverarbeitung/dienstleistungen/netzdienste/netzzugang/roaming/eduroam-os-x/) to set it up.
Also make sure to test whether it works.

## Text-processing

### ChatGPT (Plus Subscription 20$/month)
[Download](https://openai.com/chatgpt/download/) the app and install it.
Log into your account and check the preferences.

### iWriter Pro (14.99€)
Even though I tried out [iA Writer](https://ia.net/writer), [Ulysses](https://ulysses.app) and [Bear](https://bear.app), I found that [iA Writer](https://ia.net/writer) is perfect for me and also does not include a subscription service which is great.
It creates standard `txt` or `md` files which you can easily move around instead of putting everything in some proprietary database.
So overall, a great solution which also works across all my Apple devices.
It can be installed from the [App Store](https://itunes.apple.com/app/id893199093).
I quite like its defaults.

### Latex related packages (free)
I simply install [MacTex](http://www.tug.org/mactex/mactex-download.html) and use the [LaTex Workshop extension](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) for [VScode](#visual-studio-code-free) or [CursorAI](https://www.cursor.com/cursor) as my editor.

### Microsoft Excel and Word (free via university, otherwise 69€/year)
Sometimes I get documents which require [Microsoft Excel](https://apps.apple.com/us/app/microsoft-excel/id462058435?mt=12) and [Microsoft Word](https://apps.apple.com/us/app/microsoft-word/id462054704?mt=12) from the [App Store](https://apps.apple.com/de/app-bundle/microsoft-365/id1450038993?mt=12).
Luckily, I have a license via my university; but honestly, I use other tools.

### Notability (11.99€)
Notability is the app I love to use for teaching and writing down notes on my iPad.
As those notes can be synced via iCloud, I also like to have the app on my MacBook, but honestly, I mostly use it on my iPad.
It can be installed via the [App Store](https://apps.apple.com/us/app/notability/id360593530).
They recently changed to a subscription model; however, I purchased it a couple of years ago and don't need the new features yet.
Otherwise it would be 11.99€/year.
So after opening the app, I restore my purchases and sync using iCloud.

### PDF Expert (69.99€)
I have purchased PDF Expert in 2019 for any advanced PDF editing needs I have.
I really don't need any Adobe products for that.
It can be installed from the [Mac App Store](https://apps.apple.com/de/app/pdf-expert-pdf-bearbeiten/id1055273043?mt=12).
Open it and go through the settings; make sure that the purchases are restored.

### Zotero (free)
Zotero is great to keep track of the literature I use in my research and teaching.
Download it from their [website](https://www.zotero.org) and install it.
Open zotero, log in to an account, and sync the settings.
I need to install one extension called [better-bibtex](https://github.com/retorquere/zotero-better-bibtex/releases/) and also disable the LibreOffice and Word connector extensions.

In better-bibtex I set the following:
- Citation keys: Citation key formula: `authors(n=3,etal=EtAl,sep=".")+"_"+year+"_"+shorttitle(3,3)`
- Export: BibTeX Add URLs to BibTeX export: `in the 'url' field`
- Export: Fields: Fields to omit from export (comma-separated): `file`

## Coding

### Cursor AI (16$/month for a yearly subscription)
I have switched from VSCode to Cursor AI as my main IDE.
It is a great tool and I like it very much.
You can download it from [here](https://www.cursor.com/download), install it and log in with your account.
Sync your settings and extensions.
You can use the "Export Profile" command - which is native to VSCode - to save all extensions/settings to a file; then on a separate machine, "Import Profile" - in case this helps.

I do all my non-MATLAB development work and server administration stuff with VSCode.
The Apple Silicon installer can be [downloaded and installed](https://code.visualstudio.com/download).
As I use the *Settings Sync* functionality, I only need to sign in and sync all my settings and extensions cross-plattform.
Pretty great!
For completeness my extensions:

- Code Spell Checker
- German - Code Spell Checker
- GitLens - Git supercharged
- LaTeX Workshop
- latex-count
- Markdown All in One
- Matlab
- Pop Theme
- Remote - SSH
- Remote - SSH: Editing Configuration Files
- Remote Explorer

### GitKraken Pro (4.95€/year)
GitKraken is a great tool that simplifies `git` for me. I use it daily and have a Pro license. So, download the [GitKraken installer](https://www.gitkraken.com/download) and install it. Open GitKraken and set up Accounts and Settings (or restore from Backup).

### Hugo an Golang (free)
My website uses the [Hugo Academic Theme](https://github.com/wowchemy/starter-hugo-academic) for [Hugo](https://github.com/gohugoio/hugo), which is based on Go.
So I install Go and hugo with ARM Homebrew:
```sh
brew install golang hugo
```

### MATLAB (free via university, otherwise very expensive, so use GNU Octave instead)
I use MATLAB for teaching and research; unfortunately, the cost is quite high, but luckily I have a university-wide license.
So I install MATLAB using the installation files from [Mathworks](https://mathworks.com/download).
Follow the instructions to install all the toolboxes I need.
Then start MATLAB, make sure the license is activated and I sign in.
Then I go through the preference section.
In older versions, there is a `Warning: the font "Times" is not available, so "Lucida Bright" has been substituted, but may have unexpected appearance or behavor. Re-enable the "Times" font to remove this warning.`
So I download a free [times font](https://www.freebestfonts.com/timr45w-font) and install it.

### Dynare (free)
As I am a member of the development team, I need to have some tools installed with Homebrew.
For this, I've written a guide on how to [compile Dynare from source for macOS](https://git.dynare.org/Dynare/dynare#macos), which I simply follow.

### R and RStudio (free)
Install with brew:
```sh
brew install --cask r
brew install --cask rstudio
```

## Communication

### Mattermost (free)
Our Dynare team communication is happening via Mattermost which can be easily [installed via the app store](https://apps.apple.com/app/mattermost-desktop/id1614666244).
Connect the server and log in.
The preferences are synced from the server, but better safe than sorry, I double check the preferences.

### Zoom (free via university, otherwise 14.99€/month)
I use Zoom mostly for work meetings and teaching, but also the occasional private online gathering.
Also my [booking appointments system](https://schedule.mutschler.eu) automatically creates Zoom links.
The software can be installed from their [website](https://zoom.us/download).
Choose the installer for Apple Silicon/M1.
Open zoom, log in and set up audio and video, and any other settings.
Start a meeting and try out to share the screen, this will open a prompt to also enable `Screen Recording` in `Security & Privacy` settings, which I enable.

## Multimedia

### Atem Switchers Software (free)
As I use an ATEM Mini to switch video inputs for teaching and presentations, I [download](https://www.blackmagicdesign.com/support/family/atem-live-production-switchers) and install the software to make sure I have the latest firmware.
Open Atem Software Control.app and either restore your settings from a backup or set up the ATEM to your liking.

### Elgato Control Center (free)
I have two Elgato Key Lights which I usually control via Home.app (connected via [a homebridge plugin](https://github.com/derjayjay/homebridge-keylights#readme)).
To make sure I have the latest firmware I also install the [Elgato Control Center](https://www.elgato.com/en/downloads).
Once downloaded move it to the Applications folder and go through its preferences.

### Fission (42$)
For fast and lossless audio editing I have purchased [Fission](https://rogueamoeba.com/fission/).
After downloading it, move the app to the applications folder, start it and enter your license.
I also go through the preferences.

### Hand Mirror Plus (4.99€)
A neat little tool to quickly check how you look on your webcam.
Install it from the [App Store](https://apps.apple.com/us/app/hand-mirror/id1502839586?mt=12) and start it.
I usually increase the window size to max.
I also restore my plus subscription.

### OpenAudible (15.95€)
OpenAudible is an audiobook library manager that helps keep track of and back up my audible purchases.
[Download](https://openaudible.org), install and enter your license.
Then I go through the preferences, change the default file format to MP3 and adjust the library folders.
Next I connect to Audible and do a full sync of my library.

### Pro Apps Bundle for Education: Final Cut Pro (239,98€)
I purchased the [Pro Apps Bundle for Education](https://www.apple.com/at-edu/shop/product/BMGE2ZM/A/pro-apps-bundle-für-bildung) including Final Cut Pro, Logic Pro, Motion, Compressor and MainStage.
However, so far I have only used Final Cut Pro to edit my YouTube videos.
Once you get the code for the education bundle enter it in the App Store and you can download the apps you need.
I usually keep my raw video files in a folder `~/FinalCutRaw` and I don't want this in my Time Machine backups.
So I add this folder to the exception list in Time Machine.

### Creator's Best Friend (9.99€)
Creator's Best Friend converts Chapter Markers from a Final Cut Pro project into Video Chapters for YouTube.
It is very easy to use and I like that.
Install it from the [App Store](https://apps.apple.com/app/id1524172135).

### Pixelmator Pro (19.99€)
Most of the times Apple Photos is sufficient for me to edit my pictures.
However, for advanced editing I use Pixelmator Pro which can be installed from the [App Store](https://apps.apple.com/us/app/pixelmator-pro/id1289583905?mt=12).

### AlDente Pro (11.30€ p.a.)
It is well known that charging the battery to 100% is not a good idea; so I use [AlDente Pro](https://apphousekitchen.com) to keep the battery at a healthier 80%.
I am particularly using the Pro edition as I like the additional feature set.
Install it and go through the settings.

### MacUpdater 3.0 (14.99€)
The best utility to keep all apps up to date.
Highly recommended.
Install, follow the onboarding instructions and enjoy updating.

### CleanMyMac []
I am trying it out and so far I like it. One needs to `Grant Full Disk Access` in Privacy Settings. I remove Mail Attachments from the Scans.

### ControllerForHomeKit (29.99€ p.a.)
I really like this app as it offers much more flexibility and hidden options to my Homekit devices.
And most importantly, a backup setting!

### Silicon Info (free)
A neat little utility, available in the [AppStore](https://apps.apple.com/de/app/silicon-info/id1542271266?mt=12) to check which apps have not been ported yet to Apple silicon chips.

### The Unarchiver (free)
Sometimes I come across compressed formats that cannot be handled by the native archiver app.
This little tool, available in the [App Store](https://apps.apple.com/de/app/the-unarchiver/id425424353?mt=12) is my go to in these cases.

### Tor Browser (free)
Good to have this around for privacy related surfing.
[Download](https://www.torproject.org/download/) and install it.

### Backup Loupe

### DjVu Reader Pro

### EPSViewer Pro 2

### Maestral.app

## Dock


## System Settings

I open `System Settings.app` and basically go through all the settings to improve my experience on macOS.
I try to document this below.

### Apple ID (my profile picture)
- Edit the profile picture if I don't already have done so
- Check Personal Information and click on the info circle to deactivate `Announcements` and `Apps, music, TV and more`
- `Sign-In & Security`
  - Make sure that `Two-Factor Authentification` is On. 
  - I use four security keys and there are two `Trusted Phone Numbers`.
  - I also have one entry in `Recovery Contacts`, `Recovery Key` is set to `On` and I check `Legacy Contact`.
  - I turn on `Automatic Verification` to bypass CAPTHCAs.
- `Payment & Shipping`
  - Double check whether my credit card and shipping address are correct.
- `iCloud`
  - `Manage`: There is nothing to do here usually, but I still double check the storage and whether I can remove some old backups.
  - `Saved to iCloud - See All`: I typically turn syncing to iCloud `On` for all apps. But I disable `Desktop & Documents Folders` and `Optimise Mac Storage` under `iCloud Drive`. Also check the Apps that are syncing to iCloud Drive. Make sure that `Keep Messages` in `Messages in iCloud` is set to `Forever`.
  - I turn off `Private Relay` and check the entries in `Hide My Email`
  - I have Àdvanced Data Protection` enabled, so I double check the entries there as this is not a thing one should typically do.
- `Family`
  - Review the members and Parental Controls.
  - Click on each member and on myself to see the settings and `enable location sharing` if needed.
- `Media & Purchases`
  - Double-check everything under `Manage` for both my account and my subscriptions.
  - Under `Subscriptions` I enable `Share with Family` and `Renewal Receipt Emails`.
  - Activate `Use TouchID for purchases`.
- `Sign in with Apple`: double check the Apps and Websites that are using Sign in with Apple.
- `Devices`
  - I `Remove from account` any devices that I don't have anymore.
- `Contact Key Verification`
  - I turn on `Verification in iMessage`.

### Wi-Fi
- Deactivate `Ask to join networks`
- Deactivate `Ask to join hotspots`
- `Advanced`: no changes (all administrator authorisation settings are turned off) and I remove unnecessary Wi-Fi networks

### Bluetooth
- Activate bluetooth for best user experience and to get the *it just works* feeling with Apple devices.
- For Air Pods: Click on the circle i and change `Connect to this Mac` to `When last connected to this Mac`.

### Network
I add two locations (under the three dots): one called `Zuhause` (my home network) and `Tübingen` (my work network).
I remove unnecessary services in the relevant locations, rename them and add IP configurations if there are any.
The two locations are then available in the top left Apple menu.
`Firewall` is *inactive*.

### VPN
Double check whether Tailscale is activated and whether I can connect to my University VPN.

### Energy / Battery
Mac Mini
- `Energy Mode`: *High Power*
- Turn off `Prevent automatic sleeping on power adapter when the display is off`
- Turn on `Wake for network access`
- Turn on `Start up automatically after a power failure`

MacBook Pro
- `Low Power Mode`: *Never*
- Under the circle i in `Battery Health` I turn off `Optimised Battery Charging` as I am using AlDente for this.
- `Options`:
  - Turn off `Slightly dim the display on battery`
  - Turn off `Prevent automatic sleeping on power adapter when the display is off`
  - `Wake for network access`: *Always*
  - Turn off `Optimise video streaming while on battery`

### General
- `About`: Change the name of the computer.
- `Software Update`: Click on the circled i, I turn off `Download new updates when available` and `Install macOS updates`, but turn on `Install application updates from the App Store` and `Install Security Responses and system files`.
- `Storage`:
  - I don't want to store any Desktop, Documents or Photos exclusivey on iCloud, so I don't follow this recommendation.
  - Instead I click on each circled i to see what is stored where and whether I can delete some files.
- `Apple Care & Warranty`: Nothing to do.
- `AirDrop & Handoff`:
  - Turn on `Allow Handoff between this Mac and your iCloud devices`
  - `AirDrop`: *Contacts* only
  - Turn on `AirPlay Receiver`
  - `Allow AirPlay for: *Current User*
  - Turn off `Require password`
- `AutoFill & Passwords`
  - Turn on `AutoFill Passwords and Passkeys`
  - Turn on `AutoFill from Passwords`.
  - Turn on `Delete After Use` for *Verification Codes*
  - Use *Passwords* app for `Set Up Codes In`
- `Date & Time`
  - Turn on `Set time and date automatically`
  - Keep source to `Apple`
  - Turn on `24-hour time`
  - Turn on `Show 24-hour time on Lock Screen`
  - Turn on `Set time zone automatically using your current location`
- `Language & Region`
  - `Preferred Languages`: English (Primary), German (Germany)
  - `Region`: Germany
  - `Calendar`: Gregorian
  - `Temperature`: Celcius
  - `Measurement system`: Metric
  - `First day of week`: Monday
  - `Date format`: 19.08.25
  - `Number format`: 1,234,567.89
  - `List sort order`: universal
  - `Live Text`: activate
  - `Customised language settings for the following Applications`:
    - `ControllerForHomeKit`: Deutsch-German
    - `Home`: Deutsch-German
    - `MoneyMoney`: Deutsch-German
    - `PDF Expert`: Deutsch-German
    - `Safari`: Deutsch-German
  - `Translation Languages`: Download for English (US) and German (Germany), Deactivate `On-Device Mode`
- `Login Items & `Extensions`
  - `Open at Login`: Check the list of applications that open at login and remove the ones that I don't need.
  - `Allow in the Background`: Check the list of applications and deactivate the ones that I don't need.
  - `Extensions`: Check the list of extensions and deactivate the ones that I don't need.
- `Sharing`: I turn off everything except for the following:
  - `Screen Sharing`: Allow access for `Only these users` *Administrators*
  - `Remote Login`: Activate `Allow full disk access for remote users`, Allow access for `Only these users` *Administrators*
- `Startup Disk`: Nothing to do.
- `Time Machine`: Check the list of disks and the `Options`.
  - I add two external disks, one at the office and one at home, and also a NAS which is on a Dell Thinclient and can be used as a Time Machine target.
  - I do snapshots `Automatically Every Hour` snapshots (they alternate between the local disk and online NAS) and also activate `Back up on battery power`.
  - I am excluding the following folders: `~/FinalCutRaw`, `~/Movies`, `~/Music/Music`, `~/Virtual Machines.localized`
- `Device Management`: Nothing to do.
- `Transfer or Reset`: Nothing to do.

### Accessibility
I keep the defaults, except for the following:
- `Audio`: turn off `Spatial audio follows head movements`
- `Spoken Content`: System Voice *Daniel*
- `Keyboard` - `Keyboard Settings` - `Dictation`: add English (US) and German (Germany)
- I have created a `Personal Voice` with my own voice and activate `Share across devices` and `Allow applications to use your Personal Voice`.

### Appearance
- `Appearance`: *Light*
- `Accent Color`: *Multicolor*
- `Highlight Color`: *Accent Color*
- `Sidebar Icon Size`: *Small*
- `Allow wallpaper tinting in windows`: *On*
- `Show scroll bars`: *Automatically based on mouse or trackpad*
- `Click in the scroll bar to`: *Jump to the next page*

### Apple Intelligence & Siri
- `Siri`: On
- `Listen for`: Off
- `Keyboard shortcut`: Off (Mac Mini) or Hold Mic (MacBook Pro)
- `Language`: German (Germany)
- `Voice`: German (Voice 2)
- `Siri Responses`: Turn off `Voice feedback`, `Always show Siri captions`, `Always show speech`

### Control Center
- `Show in Menu Bar`: -
- `Show When Active`: Focus, Screen Mirroring, Sound, Now Playing
- `Don't Show in Menu Bar`: Wi-Fi, Bluetooth, AirDrop, Stage Manager, Display
- `Other Modules`:
  - `Battery` (on MacBook): *Show in Control Center*
  - `Energy Mode` (on Mac Mini): *Show in Menu Bar*: Show When Active, Turn on *Show in Control Center*
- `Menu Bar Only`:
  - Time Machine: Show in Menu Bar

### Desktop & Dock
I make the following changes from the defaults:
`Dock`:
  - `Double-click a window's title bar to`: Fill
  - `Automatically hide and show the Dock`: on
  - `Show suggested and recent apps in Dock`: off
- `Desktop & Stage Manager`
  - `Click wallpaper to reveal desktop`: Only in Stage Manager
- `Widgets`
  - `Widget Style`: Full-color
- `Windows`
  - `Tiled windows have margins`: off
- `Hot Corners`: remove everything

### Displays
`Advanced`
- Turn on `Show resolutions as list`
- Turn off `Allow your pointer and keyboard to move between any nearby Mac or iPad`
`Night Shift`
- `Schedule`: Sunset to Sunrise

### Screen Saver
- Turn off `Show as wallpaper`

### Spotlight
Deactivate `Tips` and `Websites`

### Wallpaper
Pick a nice one, I like *The Lake* as it is dynamic.

### Notifications
- Show previews: `When unlocked`
- Deactivate `Allow notifications when the display is sleeping`
- Activate `Allow notifications when the screen is locked`
- Deactivate `Allow notifications when mirroring or sharing the display`

`Application Notifications`: My general approach is to turn everything off and only if I miss notifications, gradually turn them back on selectively.
Currently, I have them turned on for:
Calendar, ControllerForHomeKit, FaceTime, Find My, Home, Kerberos, Messages, Personal Voice, Reminders, Things, Weather

### Sound
- Turn down the `Alert volume`
- Turn off `Play sound on startup`

### Focus
- Check the focus modes; I still aim to use this more.
- Activate `Share across devices`
- `Focus status` to `On` for all focus modes

### Screen Time
I manage the screen time of my children, but try to keep it as permissive as possible.
For me I also enable it, but don't change any settings here except I turn on `Share across devices` and turn on `App & Website Activity`.

### Lock Screen
- `Start Screen Saver when inactive`: For 5 minutes
- `Turn display off when inactive`: For 10 minutes (Mac Mini)
- `Turn display off on battery when inactive`: For 10 minutes (MacBook)
- `Turn display off on power adapter when inactive`: For 10 minutes (MacBook)
- `Require password after screen saver begins or display is turned off`: Immediately
- `Show large clock`: On Screen Saver and Lock Screen

### Privacy & Security
Activate for: Calendar, ControllerForHomeKit, Find My, Home, Maps, Messages, Reminders, Safari, Shortcuts, Siri, Voice Memos, Wallet, Weather
I keep all `System Services` activated, but turn on `Show location icon in Control Center when System Services request your location`.

### Login Password (Mac Mini)
I activate to use my Apple Watch *to unlock your applications and your Mac*.

### Touch ID & Password (MacBook)
- Touch ID: rename finger and add additional ones
- Use Touch ID to unlock your Mac: activate
- Use Touch ID for Apple Pay: activate
- Use Touch ID for purchases in iTunes Store, App Store and Apple Books: activate
- Use Touch ID for autofilling passwords: activate
- Use Touch ID for fast user switching: activate

I also activate to use my Apple Watch *to unlock your applications and your Mac*.

### Users & Groups
- Go through the users and remove unnecessary ones.
- Turn Guest User off.
- Turn off `Allow user to resset password using Apple Account`.

### Internet Accounts
Check your accounts, but typically this has all been already configured above.

### Game Center
I don't use it, so I `Sign Out`.

### iCloud
Redundant, because settings have been already configured above under the profile picture.

### Wallet & Apple Pay
- Payment Cards: check or add new ones
- Payment Details: check values
- Compatible Cards: deactivate
- Add Orders to Wallet: activate

### Keyboard
- Key repeat rate: one before fast
- Delay until repeat: two before short
- Adjust keyboard brightness in low light: activate [MacBook only]
- Keyboard brightness: low [MacBook only]
- Turn keyboard backlight off after inactivatiy: After 1 Minute [MacBook only]
- Press World key to: Show Emoji & Symbols [MacBook only]
- Press fn key to: Do Nothing [Mac Mini only]
- **Keyboard navigation: activate**
- Keyboard shortcuts: I typically leave the defaults, except:
  - Function Keys: Use F1, F2, etc. keys as standard function keys: activate
- Input Sources (Edit) - All Input Sources
  - Show Input menu in menu bar: deactivate
  - Correct spelling automatically: deactivate
  - Capitalize words automatically: deactivate
  - Show inline predictive text: activate
  - Add period with double-space: deactivate
  - Spelling: Automatic by Language
  - Use smart quotes and dashes: deactivate
- Text Replacements: I remove everything.
- Dictation
  - Use Dictation wherever you can type text: activate
  - Language: Add German
  - Microphone Source: MacBook Pro Microphone or Automatic
  - Shortcut: Press Mic or Press Control Key Twice
  - Auto-punctuation: activate

### Mouse
- Tracking speed: 7th tick
- Natural scrolling: activate
- Secondary click: Click Right Side
- Double-Click Speed: 9th tick
- Scrolling Speed: 4th tick
- Advanced: Turn on pointer accelaration

### Trackpad
- Point & Click
  - Tracking Speed: 4th tick
  - Click: Medium
  - Force Click and haptic feedback: activate
  - Look up & data detectors: Force Click with One Finger
  - Secondary click: Click or Tap with Two Fingers
  - Tap to click: activate
- Scroll & Zoom
  - Natural scrolling: activate
  - Zoom in or out: activate
  - Smart zoom: activate
  - Rotate: activate
- More Gestures
  - Swipe between pages: Scroll Left or Right with Two Fingers
  - Swipe between full-screen applications: Swipe Left or Right with Three Fingerss
  - Notification Centre: activate
  - Mission Control: Swipe Up with Three Fingers
  - App Exposé: Off
  - Launchpad: activate
  - Show Desktop: activate

### Printers & Scanners
- Default printer: Last Printer used
- Default paper size: A4
- Click on `Add` and add your printer and set your Default printer and paper size

### System extensions (if needed for kernel extensions)
To enable system extensions, you need to modify your security settings in the Recovery environment.
To do this, shut down your system, then press and hold the Touch ID or power button to launch Startup Security Utility. In Startup Security Utility, enable kernel extensions from the Security Policy button.
I currently have no need for this.

## Widgets
I use the following widgets in the widget center:
- Home (Medium), manual selection
- Calendar (Large)
- Things (List)