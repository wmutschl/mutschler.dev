---
title: 'macOS: Things to do after installation (Apps, Settings, and Tweaks)'
summary: In the following I will go through my post installation steps on macOS Ventura, i.e. which settings I choose and which apps I install and use.
header:
  image: "DeskSetup.jpg"
  caption: "Image credit: [**Willi Mutschler**](https://mutschler.dev)"
tags: ["apple", "macos", "post-installation"]
date: 2023-03-29
type: book
---

***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev). Pull requests are very much appreciated.***
<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
{{< toc hide_on="xl" >}}

Since January 2021 I've been using an Apple MacBook Air (M1) as my daily driver and have switched to a MacBook Pro (M2 Max) in March 2023. Even though I have a strong Linux background, I do like macOS quite a lot. Particularly, one of the great things about macOS is the huge amount of useful and well-designed apps, tools and utilities; not only on from the App Store but also by side-loading. Therefore, in the following I will go through my post installation steps, i.e. which apps I install and use and which system preferences I choose. In other words, this guide serves as a reminder of what I set and how I use my MacBook.

### Beware of the costs
As we all know, not only Apple hardware but also software comes at a hefty premium. I've tried to write down how much I've spent on apps and subscriptions since I started my macOS journey in January 2021, and I've documented that below for each app. Here is a rough summary for 2021:

- 700€ one-time on app purchases
- 230€/year on app subscriptions
- 240€/year on Apple One Family

This doesn't include the applications and subscriptions I tested and discarded, so there is probably a significant sunk costs as well. On the other hand, some apps are universal and I have bought them before on my iPhone or iPad. Moreover, some subscriptions are covered by my university. 

Anyways, pay attention to the cost if you decide to use Apple's eco system. My tip (unfortunately not possible anymore): Try to cover the cost by buying gift cards in advance with a 15 or 20 percent bonus credit so that the cost is reduced by that percentage. I usually do this each year to at least cover my Apple One Family and other app subscriptions.



## Basic steps
Note that I do the initial macOS setup without any devices connected to the MacBook.

### Connect Thunderbolt docks and devices
After doing the initial steps, I use the Thunderbolt ports to connect on the one hand a [LG 35WN75C-B Curved UltraWide monitor](https://www.lg.com/de/monitore/lg-35wn75c-b) (which gives me a couple of additional USB ports) and on the other hand an [Anker PowerExpand Elite 13-in-1 Thunderbolt dock](https://www.anker.com/de/a8396launch).
I then connect all my peripherals either to the monitor, docker or directly to the MacBook.

### DisplayLink adapter (only for M1 MacBook Air)
The MacBook Air M1 chip is only able to connect to a single external monitor natively; however, using an external DisplayLink Adapter I am able [to connect two or more external displays]((https://www.macworld.co.uk/how-to/how-connect-two-or-more-external-displays-apple-silicon-m1-mac-3799794/)). In particular, I connect a [FUJITSU Display B24-8 TS Pro](https://www.fujitsu.com/de/products/computing/peripheral/displays/b24-8-ts-pro/) in rotated mode. The quality is not great, either because of the adapter or the monitor or both, but as I am mostly using it to read PDFs, it does the job. To make this work, one has to install the [DisplayLink Manager](https://www.synaptics.com/products/displaylink-graphics/downloads/macos) software. After installing it, one needs to activate the app in `Screen Recording` in the `Security & Privacy` part of `System Preferences`.  Note that if you lock your system, there will be a message in the menu bar that *Your screen is being observed*.Moreover, in `Notifications & Focus` at the bottom activate `When mirroring or sharing the display` under `Allow notifications`. Furthermore, in the Apps settings, I set the rotation to 90° and set the software to launch at startup.

### Arrange displays and change desktop backgrounds
Go to `Displays` in `System Preferences` and arrange the displays. My MacBook is typically on a pile of books (on the left), the LG monitor is the main monitor and the rotated Dell monitor is on the right. I also choose different backgrounds for each monitor.

### Install Updates for MacOS
Before I proceed, I see whether a new version of MacOS is available. Go to System Settings, General, and Software Update. Reboot.

### Time Machine: Backup and restore files

The easiest way to restore everything is to use the migration assistant, but typically I only need to restore some folders and files from my Time Machine backups (or alternatively sync from my Nextcloud server).
So click on the red exclamation mark and "Claim existing backups". I then do a full back and activate both automatic backups as well as displaying it in the menu bar. After the first backup, you can either use Time Machine directly to restore certain folders and files or, alternatively, open the disk in finder, select the most recent snapshot and simply copy the files and folders over.

I add several folders to the exclude list, note that I do this in Terminal.app, because some of these folders cannot be directly added via the Time Machine app:
```sh
sudo tmutil addexclusion -p $HOME/FinalCutRaw
sudo tmutil addexclusion -p $HOME/Music
sudo tmutil addexclusion -p $HOME/Movies
sudo tmutil addexclusion -p $HOME/Parallels
sudo tmutil addexclusion -p /private/var/db/diagnostics
sudo tmutil addexclusion -p /private/var/db/oah
```
Note that you need to grant Terminal.app Full Disk Access for this.

### Browsers and extensions
#### Safari
My daily driver for surfing the web is Safari, so I go through the preferences and set it up to my liking. I also activate the `Show Favorites Bar` under View.
Lastly, I install the following extensions via the App Store:
- [Bitwarden (10$/year)](https://apps.apple.com/us/app/bitwarden/id1352778147?mt=12): This also installs a desktop app, which I start first to enable `Unlock with TouchID`. Then I set up the extension in Safari to also use Biometrics to unlock in Safari.
- [1Blocker (1.99€/month)](https://apps.apple.com/us/app/1blocker-ad-blocker-privacy/id1365531024): In the extensions panel of the Safari preferences I enable all 1Blocker extensions and then set up the app to my liking.
  
#### Chrome
For YouTube and some websites that do not work under Safari, I also install [Google Chrome](https://www.google.com/chrome/). I don't make it my default browser, but do sign in to my Google account to sync my settings and extensions. Again I am using [Bitwarden](https://chrome.google.com/webstore/detail/bitwarden-free-password-m/nngceckbapebfimnlniiiahkandclblb?hl=en) to access my passwords and [uBlock origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en) to block ads.

### Enable internet accounts for calendar, contacts and mails
In `Internet Accounts` of `System Preferences` I enable and set up my accounts for mails, calendars and contacts:
- mutschler.dev (imap/smtp)
- mutschler.eu (imap/smtp)
- dynare.org (imap/smtp)
- Nextcloud (CardDAV and CalDAV)
- University Tübingen (Exchange)
- Microsoft 365 account (Exchange)
- iCloud

### Mail
I then open Mail.App to sync my emails. Meanwhile it syncs, I go through the preferences:
- New messages sound: None
- Deactivate "Enable message follow-up suggestions"
- Composing: Message format: Plain Text
- Privacy: Activate Protect Mail Activity

I also deactivate "Organise by Conversation" in View for every Folder in every Mail Account (sic!).
Lastly, I make sure that my S/MIME certificate is working (if not, [follow these steps](https://support.apple.com/en-gb/guide/mail/mlhlp1179/15.0/mac/13.0)) and also import your private key to the Key Chain.

### Finder Preferences
I change some preferences in Finder for my convenience:

- Turn off "Show these items on the desktop"
- New Finder windows shows `wmutschl` (my user name)
- Show all items in the sidebar except Recents and AirDrop
- Show all filename extensions
- Don't show warning before changing an extension
- Don't show warning before removing from iCloud Drive
- Remove items from the Bin after 30 days
- Keep folders on top for `In windows when sorting by name`
- Keep folders on top for `On Desktop`
- When performing a search: `Search the Current Folder`

Moreover, in the View menu I activate `Show Path Bar` and `Show Status Bar`. Lastly, I change the view to list view, <kbd>CMD</kbd>+<kbd>2</kbd>, then I hit <kbd>CMD</kbd>+<kbd>j</kbd> and select the layout I want by default.
Hit `Use As Defaults` at the bottom.


## Terminal.app
The terminal is a very powerful tool I use daily for my work, so I do the following to create my development environment. So open Terminal.app and run the following commands.

### Xcode Command Line Tools
`Command Line Tools for Xcode` (like git, rsync, compilers) are important for coding and development, they can be installed by:
```sh
xcode-select --install
```


### Rosetta 2
Unfortunately, some software I use is still (and probably will never) be ported to Apple Silicon (ARM), so I make sure to install the Intel compatibility layer [Rosetta 2](https://support.apple.com/en-us/HT211861):
```sh
softwareupdate --install-rosetta --agree-to-license
```
Note that this needs to be done only once and often this is already triggered if you already installed an Intel version of a software.

### Homebrew with Alias for both Intel and ARM versions
Homebrew is the [missing package manager for macOS](https://brew.sh) which allows one to install all sorts of software and tools I need for my work. I need to make sure that I have both the Intel as well as ARM version of homebrew installed. So open terminal.app and install the ARM version of homebrew first:
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
(echo; echo 'eval "$(/opt/homebrew/bin/brew shellenv)"') >> /Users/wmutschl/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```
This installs Homebrew into `/opt/homebrew`. Next, I install the Intel version using the `arch -x86_64` prefix:
```sh
arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
This install Homebrew into `/usr/local/homebrew`. Don't run the "Next steps" as by default the ARM version should be used.
Now let's create two useful alias for both versions:
```sh
echo 'alias mbrew="/opt/homebrew/bin/brew"' >> /Users/wmutschl/.zshrc
echo 'alias ibrew="arch -x86_64 /usr/local/bin/brew"' >> /Users/wmutschl/.zshrc
```
Close and re-open your terminal and test these by e.g. running update and upgrade commands:
```sh
mbrew update && mbrew upgrade
ibrew update && ibrew upgrade
```
Note that `brew` refers to the ARM version, which is the right default for me.

### Fish (A Friendly Interactive Shell)
Instead of Apples default `zsh` shell, I like to use [Fish shell](https://fishshell.com) as it is much more [interactive and user-friendly](https://fedoramagazine.org/fish-a-friendly-interactive-shell/). This can be installed easily with (ARM) homebrew:
```sh
brew install fish
```
To make fish the default shell one needs to first include it into `/etc/shells`:
```sh
echo "/opt/homebrew/bin/fish" | sudo tee -a /etc/shells
cat /etc/shells
#/opt/homebrew/bin/fish
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
And I create Alias for ARM Homebrew and Intel Homebrew in Fish as well:
```sh
alias mbrew "/opt/homebrew/bin/brew"
funcsave mbrew

alias ibrew "arch -x86_64 /usr/local/bin/brew"
funcsave ibrew
```

### .local/bin in $PATH
I like to have `$HOME/.local/bin` in my $PATH. In Fish one can do this using the following command:
```sh
mkdir -p $HOME/.local/bin
set -Ua fish_user_paths $HOME/.local/bin
```
zsh and bash usually pick this up, once the folder is created. You can check this by opening another Terminal.app and running
```sh
bash -C "echo $PATH"
zsh -c "echo $PATH"
```

### perl: warning: Setting locale failed on servers
I sometimes get a warning "perl: warning: Setting locale failed." on my servers. A quick fix is the following:
- Open Terminal -> Preferences -> Profiles -> Advanced tab -> uncheck `Set locale environment variables on startup`

## SSH keys
If I want to create a new SSH key, I run in Terminal.app:
```sh
ssh-keygen -t ed25519 -C "MacBook Air"
```
Usually, however, I restore my `.ssh` folder from my backup (see above). Either way, afterwards, one needs to add the file containing your key, usually `id_rsa` or `id_ed25519`, to the ssh-agent. First start the ssh-agent in the background:
```sh
eval "$(ssh-agent -s)" #works in bash,zsh
eval (ssh-agent -c) #works in fish
```
Next, we need to modify `~/.ssh/config` file to automatically load keys into the ssh-agent and store passphrases in the keychain. As I restore from backup, I don't have to do this step. But for completeness, if the file does not exist yet, create and open it:
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
If your SSH key file has a different name or path than the example code, modify the filename or path to match your current setup. Note: If you chose not to add a passphrase to your key, you should omit the *UseKeychain* line. Lastly, let's add our private SSH key to the ssh-agent:
```sh
ssh-add -K ~/.ssh/id_ed25519
```
Don't forget to add your public key to GitHub, Gitlab, Servers, etc.

## Private GPG key with Yubikey
I store my private GPG key on two Yubikeys (a tutorial on how to put it there is taken from [Heise](https://www.heise.de/ratgeber/FIDO2-YubiKey-als-OpenPGP-Smartcard-einsetzen-4590032.html) or [YubiKey-Guide](https://github.com/drduh/YubiKey-Guide)). For this I need to install several packages via ARM Homebrew first
```sh
brew install gnupg pinentry-mac yubikey-personalization ykman
```
Make sure that the .gnupg folder has the correct permissions:
```sh
find ~/.gnupg -type f -exec chmod 600 {} \;
find ~/.gnupg -type d -exec chmod 700 {} \;
```
Now insert the first Yubikey and check whether it is recognized:
```sh
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
# PIV     	Enabled	Enabled	
# OATH    	Enabled	Enabled 	
# FIDO2   	Enabled	Enabled 	
```
Do the same for the backup Yubikey. Make sure that OpenPGP and PIV are enabled on both Yubikeys as shown above. Next, check whether the GPG card on both Yubikeys is readable by gpg:
```sh
gpg --card-status
# Reader ...........: Yubico YubiKey OTP FIDO CCID
# Application ID ...: D2760001240100000006096001740000
# Application type .: OpenPGP
# Version ..........: 0.0
# Manufacturer .....: Yubico
# Serial number ....: 09600174
# Name of cardholder: [not set]
# Language prefs ...: [not set]
# Salutation .......: 
# URL of public key : [not set]
# Login data .......: [not set]
# Signature PIN ....: not forced
# Key attributes ...: rsa4096 rsa4096 rsa4096
# Max. PIN lengths .: 127 127 127
# PIN retry counter : 3 0 3
# Signature counter : 652
# UIF setting ......: Sign=off Decrypt=off Auth=off
# Signature key ....: C13E 5D55 8A9F 4AFE AE08  6186 91E7 24BF 17A7 3F6D
#     created ....: 2019-12-09 08:36:41
# Encryption key....: 5D12 A11E 39A6 1ED2 E0F9  9F23 16B5 237D 5563 8B96
#     created ....: 2019-12-09 08:36:41
#Authentication key: E1B6 6FC6 852C 0FC1 9917  D825 8CFE 5D68 CC28 71C3
#     created ....: 2019-12-09 08:38:21
#General key info..: pub  rsa4096/91E724BF17A73F6D 2019-12-09 Willi Mutschler <willi@mutschler.eu>
#sec>  rsa4096/91E724BF17A73F6D  created: 2019-12-09  expires: never     
#                                card-no: 0006 09600174
#ssb>  rsa4096/16B5237D55638B96  created: 2019-12-09  expires: never     
#                                card-no: 0006 09600174
#ssb>  rsa4096/8CFE5D68CC2871C3  created: 2019-12-09  expires: never     
#                                card-no: 0006 09600174
```
My public key is stored in a file `$HOME/.gnupg/public.asc` which I either copy from backup or download from GitHub:
```
curl https://github.com/wmutschl.gpg > $HOME/.gnupg/public.asc
````
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



## Apple Apps
Before I install additional apps, I go through all the applications Apple ships by default in order to provide the necessary permissions and change some settings. So I click on all the apps in Launchpad and first delete all the apps that I don't use.
Then I make changes to some app settings, which I list below.

#### App Store
Turn off Video Autoplay and Automatic Updates as I usually do manual updates once a week to not miss new features.

#### Contacts
Check whether all contacts are correctly synced and sort by first name. Adjust the Default Account.

#### Calendar
Check whether all calendars are correctly synced and set the default calendar and notification times.

#### Reminders
Check the Default List.

#### Notes
Set the Default account; do not Enable the On My Mac account.

#### FaceTime
Make sure the Account is enabled and the numbers to be reached by are checked. Deactivate "Automatic Camera Selection" under Video.

#### iMessage
First, sign in to iMessage and then set up *Name and Photo* or make sure it is in sync.
Second, turn on *Enable Messages in iCloud* and *Send read receipts*. Also make sure that messages are kept forever. Lastly, I sign in to FaceTime and check the settings as well.

#### Photo Booth
Deactivate "Automatic Camera Selection" under Camera.

#### Photos
Make sure they are restored from your backup and in sync. Then go to preferences and check the following:
- [x] Download Originals to this Mac
- [x] Deactivate Autoplay Videos and Live Photos
- [x] Activate Show Holiday Events
- [x] Activate Show Memories Notifications
- [x] Sharing: Include location information

#### Music
Turn on Lossless audio.

#### Podcasts
I don't use this app, so turn Automatic Download Off.

#### TV
Turn on "Automatically delete watched movies and TV shows".

#### Keynote, Numbers, Pages
Deactivate "Correct spelling automatically" and "Capitalise words automatically".

#### Weather
Enable notifications for "Severe Weather" and "Next-hour Precipitation"

#### Home
Make sure you have access to your Home.

#### Shortcuts
If one needs it: Activate "Allow Running Scripts"

#### Text Edit
Deactivate "Correct spelling automatically"

#### Keychain Access
Make sure my personal certificate is used for the correct emails and the private key is added.

#### Disk Utility
In the view menu I select to `Show all devices` and `Show APFS Snapshots`.

#### Digital Colour Meter
Select "as Hexadecimal" under View-Display Values.

#### Other apps
Nothing to do in: Maps, Find My, Preview, Voice Memos, Stocks, Books, Dictionary, Calculator, Freeform, Clock, QuickTime Player, Grapher, Font Book, Chess, Stickies, Image Capture, Voice Over Utility, AirPort Utility, Migration Assistant, Activity Monitor, Console, System Information, Automator, Script Editor, Color Sync Utility, Screenshot,Blueetooth File Exchange, Audio Midi Setup


## Apps, Apps, Apps
In the following I list the tools I use, how to install and configure them. 

### Productivity and Utilities

#### Amphetamine and Amphetamine Enhancer (free)
A little helper in case my MacBook needs to stay up all night. It can be installed from the App Store. Start the app and follow the instructions on the welcome screen.


#### Dockey (free)
This neat little app makes the Dock behave as I like. [Download](https://dockey.publicspace.co) it and move it manually to the Applications folder. I choose the following preferences:
- Auto-Hide Dock: Hide
- Animation Delay: Little
- Animation Speed: Fast

#### Logi Options+ (free)
Install the software and follow the onboarding screen to allow some permissions in `Security & Privacy`, i.e. `Accessibility`,  `Bluetooth` and `Input Monitoring`. I set some general behavior; particularly, I don't use natural scrolling on the scroll wheel and use the inverted direction for the thumb wheel. I then have a look at the global settings of the buttons. I remap the default behavior of the forward and back buttons to copy and paste. I remap the gestures such that clicking the thumb button opens Mission Control, hold+left goes back, hold+right goes forward, hold+up opens a terminal, hold+down opens Safari.


#### Mission Control Plus (9.65€)
From Gnome I am used to be able to close the windows from the activity overview, which is called mission control on macOS. So I download [Mission Control plus](https://www.fadel.io/missioncontrolplus) for which I already purchased a license. Unzip it and manually move it to the applications folder. Open the app and follow the instructions. Then enter the license in the menu bar and I choose to hide the menu icon.

#### Moom (9.99€)
There are many options for tiling windows on macOS. I find Moom quite flexible and install it via the [App Store](https://apps.apple.com/us/app/moom/id419330170?mt=12).  I choose to run it as a menu bar application and open at startup. I also add a keyboard shortcut <kbd>CTRL</kbd>+<kbd>space</kbd> and add layouts I use often to shortcuts. When I have a working configuration I backup the settings by running in terminal.app:
```sh
defaults export com.manytricks.Moom ~/Moom.plist
```
So when I re-install Moom I can simply restore my settings by running in terminal.app:
```sh
defaults import com.manytricks.Moom ~/Moom.plist
```

#### Money Money (29.99€)
I really like this tool for my banking so I purchased a license. Download the software from the [App Store](https://apps.apple.com/de/app/moneymoney/id872698314?mt=12) and open it. Immediately in the menu bar I select `Help`-`Show database in Finder`. Close Money Money completely (<kbd>CMD</kbd>+<kbd>q</kbd>). Then I delete the three folders `Database`, `Extensions` and `Statements` and restore them from my backup. Restart Money Money, enter your database password and license. Then I go through the settings.


#### Nextcloud (free)
I have all my user files synced to my own Nextcloud server, see my [backup strategy](../../linux/backup), so I need the sync client, which can be [downloaded](https://nextcloud.com/install/#install-clients). Open nextcloud.app and set up the server and a first folder sync. After the first sync, I need to recheck the options and particularly launch the app on System startup, deactivate 500 MB limit and edit the ignored files. Usually, I don't sync hidden files and add `.DS_Store` and `*.photoslibrary` to the ignored files list only. Again make sure to adjust settings after the first folder sync, because otherwise the Global Ignore Settings cannot be adjusted.


#### Reeder 5 (9.99€)
This is my go to RSS reader app on my iPhone, iPad and MacBook. I usually use it on my iPhone, but I also want it on my MacBook, so download it from the [App Store](https://apps.apple.com/de/app/reeder-5/id1529448980?mt=12) and enable syncing feeds via iCloud. Activate `Don't fetch on this mac` as I am fetching the feeds on my iPhone.

#### Things 3 (49.99€)
My favorite To-Do app, which I've bought for all my devices. Download from the [App Store](https://apps.apple.com/de/app/things-3/id904280696?mt=12), start it and enable Things Cloud. This syncs my to-do's between my devices. I then go through the preferences and adjust to my liking.

#### Timeular (89€)
I've purchased a [Timeular Tracker](https://timeular.com/tracker/) in 2021, which came with the [Basic plan](https://timeular.com/pricing/) for free. Now, the tracker is cheaper (69€), but the basic plan is not included anymore and costs 5€/month. So I am quite happy with my deal. Anyways, I install the app from the [website](https://timeular.com/download/), start it and sign in. This syncs my data and settings.


### Networking and Virtualization

#### Tailscale (free)
This is an amazing piece of software based on wireguard to connect all my devices no matter where I am at or if there are firewalls between the devices. It creates a Mesh network and I can access securely all my mobile devices, computers and servers without exposing them to the internet. Tailscale can be downloaded from the [App Store](https://apps.apple.com/us/app/tailscale/id1475387142?mt=12). Open the app and select to auto start on login. The app resides as a tray icon, which you can click to sign in to your account, change some settings and easily access the IP addresses of the different machines.


#### NoMachine
I use [NoMachine](https://www.nomachine.com) on servers that have a desktop environment. So I download the client, install it, open it and change the settings; particularly, deactivating "Start the server at system startup" and "Shut down the Server". Using the [Tailscale](#tailscale-free) IPs I can then connect to my servers.

#### Parallels (39.99€/year)
This is a powerful and user-friendly piece of software to run virtual machines (VM). Particularly, I like to try out Linux ARM VM's, Raspberry Pi Images, or MacOS clean installs to test Dynare versions. Parallels can be downloaded from their [website](https://www.parallels.com/products/desktop/trial/) after signing up. I am eligible to use the Education version, which is sufficient for my needs. After installation and activating the software I go through the settings. If I have not done so already, I also create a clean MacOS install for testing. Note that all VMs will be installed into `~/Parallels`. Obviously, I don't want the virtual machines in my Time Machine backups, so I exclude this folder in my Time Machine preferences.

#### Screens 4 (29.99€)
To access my servers via VNC or my MacBook from remote, I use Screens 4 combined with [Tailscale](#tailscale-free). It can be downloaded from the [App Store](https://apps.apple.com/de/app/screens-4/id1224268771?mt=12) and I set it up to use sync my settings via iCloud. Particularly, I sync my machines and like to share the clipboard.


#### University VPN and eduroam (free)
To access the VPN of my university and connect to the [eduroam wifi network](https://eduroam.org), I need to install two profiles. So first download these

- [eduoroam profile](https://uni-tuebingen.de/fileadmin/Uni_Tuebingen/Einrichtungen/ZDV/Dokumente/Anleitungen/eduroam/eduroam_2021.mobileconfig)
- [VPN profile](https://uni-tuebingen.de/fileadmin/Uni_Tuebingen/Einrichtungen/ZDV/Dokumente/Anleitungen/VPN/vpn-uni-tuebingen-2021.mobileconfig)

Then go to settings and install those profiles. Afterwards one simply follows the [VPN guide](https://zdv-wiki.uni-tuebingen.de/display/CICS/VPN+Configuration+on+macOS) or the [eduroam guide](https://uni-tuebingen.de/en/einrichtungen/zentrum-fuer-datenverarbeitung/dienstleistungen/netzdienste/netzzugang/roaming/eduroam-os-x/) to set it up. Also make sure to test whether it works.



### Text-processing

#### DeepL (free)
One of the best tools ever to translate chunks of text from one language into another. [Download](https://www.deepl.com/en/app/) and install it. Now every time I hit <kbd>CMD</kbd>+<kbd>c</kbd> twice, my selected text will be sent to DeepL and auto-translated. I often improve my texts by translating the texts back and forth while adjusting the expressions by right-clicking on words and phrases.

#### iWriter Pro (14.99€)
Even though I tried out [iA Writer](https://ia.net/writer), [Ulysses](https://ulysses.app) and [Bear](https://bear.app), I found that [iA Writer](https://ia.net/writer) is perfect for me and also does not include a subscription service which is great. It creates standard `txt` or `md` files which you can easily move around instead of putting everything in some proprietary database. So overall, a great solution which also works across all my Apple devices. It can be installed from the [App Store](https://apps.apple.com/de/app/ia-writer/id775737590?mt=12). Start it and enable iCloud sync to get all your files. Also check the preferences, settings and themes. I quite like the default though.

#### Keynote (free)
Instead of Powerpoint I really like Apples take on presentations. It can be installed via thee [App Store](https://www.zotero.org). Open it and go through the settings.

#### Latex related packages (free)
I simply install [MacTex](http://www.tug.org/mactex/mactex-download.html) and use the [LaTex Workshop extension](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) for [VScode](#visual-studio-code-free) as my editor.

#### Liquid Text LIVE (95.99€/year)
I use this app both on my Mac and iPad for research, it can be installed from the [App Store](https://apps.apple.com/us/app/liquidtext/id922765270) and has [different versions](https://www.liquidtext.net/pricing-features). As I am using it on my iPad as well I chose the LIVE edition. It does need some getting used to, particularly the handling of folders and files, but it is really great to collect thoughts and read papers for research, teaching and other projects. Highly recommended! After installation I need to restore my purchases to re-activate my license and sync my database (or Login to Existing Account).

#### Microsoft Excel and Word (free via university, otherwise 69€/year)
Sometimes I get documents which require [Microsoft Excel](https://apps.apple.com/us/app/microsoft-excel/id462058435?mt=12) and [Microsoft Word](https://apps.apple.com/us/app/microsoft-word/id462054704?mt=12) from the [App Store](https://apps.apple.com/de/app-bundle/microsoft-365/id1450038993?mt=12). Luckily, I have a license via my university; but honestly, I try to use other tools.

#### Notability (11.99€)
Notability is the app I love to use for teaching and writing down notes on my iPad. As those notes can be synced via iCloud, I also like to have the app on my MacBook, but honestly, I mostly use it on my iPad. It can be installed via the [App Store](https://apps.apple.com/us/app/notability/id360593530). They recently changed to a subscription model; however, I purchased it a couple of years ago and don't need the new features yet. Otherwise it would be 11.99€/year. So after opening the app, I restore my purchases and sync using iCloud.

#### PDF Expert (69.99€)
I have purchased PDF Expert in 2019 for any advanced PDF editing needs I have. I really don't need any Adobe products for that. It can be installed from the [Mac App Store](https://apps.apple.com/de/app/pdf-expert-pdf-bearbeiten/id1055273043?mt=12). Open it and go through the settings; make sure that the purchases are restored.


#### Zotero (free)
Zotero is great to keep track of the literature I use in my research and teaching. Download it from their [website](https://www.zotero.org) and install it. Open zotero, log in to an account, and sync the settings. I need to install one extension called [better-bibtex](https://github.com/retorquere/zotero-better-bibtex/releases/) and also disable the LibreOffice and Word connector extensions.

In better-bibtex I set the following:
- Citation keys: Citation key formula: `authors(n=3,etal=EtAl,sep=".")+"_"+year+"_"+shorttitle(3,3)`
- Export: BibTeX Add URLs to BibTeX export: `in the 'url' field`
- Export: Fields: Fields to omit from export (comma-separated): `file`




### Coding

#### GitKraken (4.95€/month)
GitKraken is a great tool that simplifies `git` for me. I use it daily and have a Pro license. So, download the [GitKraken installer](https://www.gitkraken.com/download) and install it. Open GitKraken and set up Accounts and Settings (or restore from Backup).

#### Hugo an Golang (free)
My website uses the [Hugo Academic Theme](https://github.com/wowchemy/starter-hugo-academic) for [Hugo](https://github.com/gohugoio/hugo), which is based on Go. So I install Go and hugo with ARM Homebrew:
```sh
mbrew install golang hugo
```

#### MATLAB (free via university, otherwise 500€ + 250€ per toolbox)
I use MATLAB for teaching and research; unfortunately, the cost is quite high, but luckily I have a university-wide license. So I install MATLAB using the installation files from [Mathworks](https://mathworks.com/download). Follow the instructions to install all the toolboxes I need. Then start MATLAB, make sure the license is activated and I sign in. Then I go through the preference section.
In older versions, there is a `Warning: the font "Times" is not available, so "Lucida Bright" has been substituted, but may have unexpected appearance or behavor. Re-enable the "Times" font to remove this warning.` So I download a free [times font](https://www.freebestfonts.com/timr45w-font) and install it.


#### Visual Studio Code (free)
I do all my non-MATLAB development work and server administration stuff with VSCode. The Apple Silicon installer can be [downloaded and installed](https://code.visualstudio.com/download). As I use the *Settings Sync* functionality, I only need to sign in and sync all my settings and extensions cross-plattform. Pretty great! For completeness my extensions:

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


#### Dynare (free)
As I am a member of the development team, I need to have some tools installed with Homebrew. For this, I've written a guide on how to [compile Dynare from source for macOS](https://git.dynare.org/Dynare/dynare#macos), which I simply follow.






### Communication

#### Mattermost (free)
Our Dynare team communication is happening via Mattermost which can be easily [installed via the Mac App Store](https://mattermost.com/download/#). Connect the server and log in. The preferences are synced from the server, but better safe than sorry, I double check the preferences.

#### Skype (free)
I use Skype to communicate with work colleagues. The Skype Insider Program offers a native Apple Silicon variant of Skype and can be [downloaded here](https://www.skype.com/de/insider/).
Open skype, log in and set up audio and video. Start a meeting and try out to share the screen, this will open a prompt to also enable `Screen Recording` in `Security & Privacy` settings, which I enable.


#### Zoom (free via university, otherwise 14.99€/month)
I use Zoom mostly for work meetings and teaching, but also the occasional private online gathering. Also my [booking appointments system](https://schedule.mutschler.eu) automatically creates Zoom links. The software can be installed from their [website](https://zoom.us/download). Choose the installer for Apple Silicon/M1. Open zoom, log in and set up audio and video, and any other settings. Start a meeting and try out to share the screen, this will open a prompt to also enable `Screen Recording` in `Security & Privacy` settings, which I enable.

### Multimedia

#### Atem Switchers Software (free)
As I use an ATEM Mini to switch video inputs for teaching and presentations, I [download](https://www.blackmagicdesign.com/support/family/atem-live-production-switchers) and install the software to make sure I have the latest firmware. Open Atem Software Control.app and either restore your settings from a backup or set up the ATEM to your liking.

#### Elgato Control Center (free)
I have two Elgato Key Lights which I usually control via home.app (connected via [a homebridge plugin](https://github.com/derjayjay/homebridge-keylights#readme)). To make sure I have the latest firmware I also install the [Elgato Control Center](https://www.elgato.com/en/downloads). Once downloaded move it to the Applications folder and go through its preferences.

#### Fission (42$)
For fast and lossless audio editing I have purchased [Fission](https://rogueamoeba.com/fission/). After downloading it, move the app to the applications folder, start it and enter your license. I also go through the preferences.

#### Hand Mirror Plus (4.99€)
A neat little tool to quickly check how you look on your webcam. Install it from the [App Store](https://apps.apple.com/us/app/hand-mirror/id1502839586?mt=12) and start it. I usually increase the window size to max. I also restore my plus subscription.

#### Narrated (16.99€)
A neat little software for screen recordings with a personal touch which I like to use for simple screen recordings.
Download from the [website](https://www.buildandshipapps.com), open it and allow the required permissions in `Security & Privacy`. Close the overlay of the app so you can access the menu bar to change some settings and enter the license key.

#### OpenAudible (15.95€)
OpenAudible is an audiobook library manager that helps keep track of and back up my audible purchases. [Download](https://openaudible.org), install and enter your license. Then I go through the preferences, change the default file format to MP3 and adjust the library folders. Next I connect to Audible and do a full sync of my library.

#### Pro Apps Bundle for Education: Final Cut Pro (239,98€)
I purchased the [Pro Apps Bundle for Education](https://www.apple.com/at-edu/shop/product/BMGE2ZM/A/pro-apps-bundle-für-bildung) including Final Cut Pro, Logic Pro, Motion, Compressor and MainStage. However, so far I have only used Final Cut Pro to edit my YouTube videos. Once you get the code for the education bundle enter it in the App Store and you can download the apps you need. I usually keep my raw video files in a folder `~/FinalCutRaw` and I don't want this in my Time Machine backups. So I add this folder to the exception list in Time Machine.

#### Creator's Best Friend (9.99€)
Creator’s Best Friend converts Chapter Markers from a Final Cut Pro project into Video Chapters for YouTube. It is very easy to use and I like that. Install it from the [App Store](https://apps.apple.com/app/id1524172135).

#### Pixelmator Pro (19.99€)
Most of the times Apple Photos is sufficient for me to edit my pictures. However, for advanced editing I use Pixelmator Pro which can be installed from the [App Store](https://apps.apple.com/us/app/pixelmator-pro/id1289583905?mt=12).


#### AlDente Pro (11.30€ p.a.)
It is well known that charging the battery to 100% is not a good idea; so I use [AlDente Pro](https://apphousekitchen.com) to keep the battery at a healthier 80%. I am particularly using the Pro edition as I like the additional feature set. Install it and go through the settings.

#### CleanMyMac X [wip]
I am trying it out and so far I like it. One needs to `Grant Full Disk Access` in Privacy Settings. I remove Mail Attachments from the Scans.

#### ControllerForHomeKit (29.99€ p.a.)
I really like this app as it offers much more flexibility and hidden options to my Homekit devices. And most importantly, a backup setting!

#### Silicon Info (free)
A neat little utility, available in the [AppStore](https://apps.apple.com/de/app/silicon-info/id1542271266?mt=12) to check which apps have not been ported yet to Apple silicon chips.

#### The Unarchiver (free)
Sometimes I come across compressed formats that cannot be handled by the native archiver app. This little tool, available in the [App Store](https://apps.apple.com/de/app/the-unarchiver/id425424353?mt=12) is my go to in these cases.

#### Tor Browser (free)
Good to have this around for privacy related surfing. [Download](https://www.torproject.org/download/) and install it.

## System Settings

I open `System Settings` and basically go through all the settings to improve my experience on macOS. I try to document this below.


#### Apple ID
- Edit the profile picture
- `Name, Phone, Email`
  - deactivate `Announcements` and `Apps, music, TV and more`
- `Password & Security`
  - Make sure that `Two-Factor Authentification` is On. 
  - I also use Security keys and there is at least one `Trusted Phone Numbers`.
  - I also `manage` the information in `Account Recovery` and `Legacy Contact` if there are changes.
  - `Automatic Verification` is also on.
  - Lastly, it is nice to clean up `Apps Using Apple ID`.
- `Payment & Shipping`
  - Double check whether my credit card and shipping address are correct.
- `iCloud`
  - `Account Storage`: double check whether anything unusual (old devices) takes too much space
  - Deactivate `Optimise Mac Storage`
  - `Apps Using iCloud`:
    - Turn on all services I use, i.e. everything except *Private Relay* and *Hide My Email*. Click on each entry and double check options.
    - I activate `Advanced Data Protection`
    - Deactivate `Access iCloud Data on the Web`
- `Media & Purchases`
  - Double-check everything under `Manage` for both my account and my subscriptions. Particularly, I `Share New Subscriptions` with my family and want to receive `Renewal Receipts`.
  - Enable `Use TouchID for purchases`.
- `Family Sharing`
  - I check if I share all subscribed apps with my family and also if the roles are correct. Moreover, I go through everything under `Shared with your Family` and make changes if needed.
  - Double check the `subscriptions`
  - Enable `Purchase Sharing`
  - Enable `Location Sharing` with familiy
- `Devices`
  - I `Remove from account` any devices that I don't have anymore.

#### Wi-Fi
- Deactivate `Ask to join networks`
- Deactivate `Ask to join hotspots`
- `Advanced`: no changes, remove unnecessary Wi-Fi networks

#### Bluetooth
- Activate
- For Air Pods: Change `Connect to this Mac` to `When last connected to this Mac`

#### Network
I add two locations (under the three dots): one for Home and one for Work. I remove unnecessary services, rename them and add IP configurations if there are any. The two locations are then available in the top left Apple menu.

#### VPN
Double check whether Tailscale is activated and whether I can connect to my University VPN.

#### Notifications
- Show previews: `When unlocked`
- Deactivate `Allow notifications when the display is sleeping`
- Deactivate `Allow notifications when the screen is locked`
- Deactivate `Allow notifications when mirroring or sharing the display`
- `Application Notifications`: My general approach is to turn everything off and only if I miss notifications, gradually turn them back on selectively. For instance for Calendar, CleanMyMac X, FaceTime, Find My, Home, Kerberos, Messages, Reminders, Things, Timeular

#### Sound
- Turn down the `Alert volume`
- Turn off `Play sound on startup`

#### Focus
- Check the focus modes; I still aim to use this more.
- Activate `Share across devices`
- `Focus status` to `On` for all focus modes

#### Screen Time
I manage the screen time of my children, but try to keep it as permissive as possible.
For me I also enable it, but don't change any settings here.




#### General: About
- Change the name of the computer

#### General: Software Update
- Automatic Updates: `Security Updates Only`
  - Activate `Check for updates`
  - Deactivate `Download new updates when available`
  - Deactivate `Install macOS updates`
  - Deactivate `Install application updates from the App Store`
  - Activate `Install Security Responses and system files`

#### General: Storage
I don't use `Store in iCloud`. Go through the settings hidden under the circled i. Particularly, I remove the Garage Band files.

#### General: AirDrop & Handoff
- Activate `Allow Handoff between this Mac and your iCloud devices`
- AirDrop: `Contacts Only`
- Activate `AirPlay Receiver`
- Allow AirPlay for `Current User`
- Deactivate `Require password`

#### General: Login Items
Double check the `Open at Login` and `Allow in Background` lists whether there is something that I don't need. Particularly, `Google Updater`.

#### General: Language & Region
- Preferred Languages: English (Primary), German (Germany)
- Region: Germany
- Calendar: Gregorian
- Temperature: Celcius
- Measurement system: Metric
- First day of week: Monday
- Date format: 19.08.23
- Number format: 1,234,567.89
- List sort order: universal
- Live Text: activate
- Customised language settings for the following `Applications`:
  - ControllerForHomeKit (Deutsch-German)
  - Home (Deutsch-German)
  - MoneyMoney (Deutsch-German)
- Translation Languages: Download for English (US) and German (Germany)

#### General: Date & Time
- Activate `Set time and date automatically`
- Source: Apple
- 24-hour time: activate
- Time zone: Centreal European
- Closest city: Berlin - Germany

#### General: Sharing
For my Work Location I enable Internet Sharing of the Ethernet connection via Wi-Fi. Click on the circled i to edit the settins, then activate it.

#### General: Time Machine
I add two external disks, one at the office and one at home, and also a NAS which is on a Raspberry pi and can be used as a Time Machine target. I do hourly snapshots (they alternate between the local disk and online NAS). My exclude list is given above.

#### General: Transfer or Reset
Nothing to do.

#### General: Startup Disk
Nothing to do.

#### Appearance
- Appearance: Light
- Accent color: multicolor (first one)
- Highlight color: `Accent Color`
- Sidebar icon size: `Small`
- Activate `Allow wallpaper tinting in windows`
- Show scroll bars: `Automatically based on mouse or trackpad`
- Click in the scroll bar to: `Jump to the next page`

#### Accessibility
Nothing to do.

#### Control Centre
- Wi-Fi: Don't Show in Menu Bar
- Bluetooth: Don't Show in Menu Bar
- AirDrop: Don't Show in Menu Bar
- Focus: Show When Active
- Stage Manager: Don't Show in Menu Bar
- Screen Mirroring: Show When Active
- Display: Show When Active
- Sound: Show When Active
- Now Playing: Show When Active
- Accessibility Shortcuts:
  - Deactivate Show in Menu Bar
  - Deactivate Show in Control Centre
- Battery
  - Deactivate Show in Menu Bar (as I use AlDente)
  - Activate Show in Control Centre
  - Activate Show Percentage
- Hearing:
  - Deactivate Show in Menu Bar
  - Deactivate Show in Control Centre
- Fast User Switching
  - Show in Menu Bar: Don't Show
  - Show in Control Centre: Deactivate
- Keyboard Brightness:
  - Show in Menu Bar: Deactivate
  - Show in Control Centre: Deactivate
- Menu Bar Only
  - Clock: Date
    - Show date: When Space Allow
    - Show the day of the week: Activate
  - Clock: Time
    - Style: Digital
    - Use a 24-hour clock: activate
    - Show am/pm: deactivate
    - Flash the time separators: deactivate
    - Display the time with seconds: deactivate
    - Announce the time: deactivate
    - Interval: On the hour
  - Spotlight: Don't Show in Menu Bar
  - Siri: Don't Show in Menu Bar
  - Time Machine: Show in Menu Bar
  - VPN: Don't Show in Menu Bar

#### Siri & Spotlight
- Ask Siri: Activate
- Listen for "Hey Siri": deactivate
- Keyboard shortcut: hold mic
- Language: German (Germany)
- Siri voice: German (Voice 2)
- Siri Suggestions & Privacy: Activate everything
- Siri Responses
  - Voice feedback: deactivate
  - Always show Siri captions: deactivate
  - Always show speech: deactivate
- Spotlight: activate everything
- Spotlight Privacy: Add NAS with Time Machine Backup

#### Privacy & Security
- Privacy Location Services
  - activate for: Calendar, ControllerForHomeKit, Find My, Home, Maps, Reminders, Safari, Siri & Dictation, Wallet, Weather
  - System Services activate for: Location-based alerts, Location-based suggestions, Setting time zone, System customisation, Significant locations, Find My Mac, HomeKit, Networking and wireless
  - System Services deactivate for Mac Analytics
  - Activate Show location icon in Control Centre When System Services request your location

#### Destkop & Dock
- Size: leave at default (about 40%)
- Magnification: Activate and set to about 50%
- Position on screen: Bottom
- Minimize windows using: Genie effect
- Double-Click a window’s title bar: zoom
- Minimize windows into application icon: activate
- Automatically hide and show the Dock: activate
- Animate opening applications: activate
- Show indicators for open applications: activate
- Show recent applications in Dock: activate
- Menu Bar
  - Automatically hide and show the menu bar on desktop: in Full Screen Only
  - Recent documents, applications and servers: 10
- Windows & Apps
  - Prefer tabs when opening documents: In Full Screen
  - Ask to keep changes when closing documents: deactivate
  - Close windows when quitting an application: activate
- Stage Manager: deactivate
- Default web browser: Safari.app
- Mission Control
  - Automatically rearrange Spaces based on recent use: activate
  - When switching to an application, switch to a Space with open windows for the application: deactivate
  - Group windows by application: deactivate
  - Displays have separate Spaces: activate
- Shortcuts:
  - Mission Control: Keyboard Shortcut: <kbd>CTRL</kbd>+<kbd>↑</kbd>, Mouse Shortcut: -
  - Application windows: Keyboard Shortcut: <kbd>CTRL</kbd>+<kbd>↓</kbd>, Mouse Shortcut: -
  - Show Desktop: Keyboard Shortcut: F11, Mouse Shortcut: -
- Hot Corners: Deactivate

#### Displays
Arrange the monitors, then go to
- Advanced: 
  - Show resolutions as list: activate
  - Link to Mac or iPad:
    - Allow your pointer and keyboard to move between any nearby Mac or iPad: activate
    - Push through the edge of a display to connect a nearby Mac or iPad: activate
    - Automatically reconnect to any nearby Mac or iPad: activate
  - Battery & Energy:
    - Slightly dim the display on battery: activate
    - Prevent automatic sleeping on power adapter when the display is off: deactivate
- Night Shift
  - Schedule: Off
  - Turn on until tomorrow: deactivate
  - Colour temperature: in the middle
- Built-in Display:
  - Use as `Extended display` with 1512x982 (Default)
  - Automatically adjust brightness: activate
  - True Tone: activate
  - Presets:
    - Apple XDR Display (P3-1600nits), Refresh rate: ProMotion
- LG HDR WQHD:
  - Use as `Main display` with 3440x1440 (Default)  
  - Colour profile: LG HDR WQHD
  - Refresh rate: 100 Hertz
  - High Dynamic Range: deactivate
  - Rotation: Standard
- B24-8 TS Pro:
  - Use as `Extended display` with 1080x1920 (Default)  
  - Colour profile: B24-8 TS Pro
  - Refresh rate: 60 Hertz
  - Rotation: 90

#### Wallpaper
Desktop: Set background for each display. I like to use the Dynamic Desktops, `The Beach` for the MacBook Air, `The Lake` for the LG Monitor, and `The Cliffs` for the Fujitsu Monitor.

#### Screen Saver
- I like the `Hello` screensaver and use the default `Screen Saver Options`.
- Activate Show with clock.

#### Battery
- Low Power Mode: Never
- Battery Health click on i
  - Optimised Battery Charging: deactivate
- Options
  - Wake for network access: Only on Power Adapter
  - Optimise video streaming while on battery: deactivate


#### Lock Screen
- Start Screen Saver when inactive: For 10 Minutes
- Turn display off on battery when inactive: For 10 Minutes
- Turn display off on power adapter when inactive: For 20 Minutes
- Require password after screen saver begins or display is turned off: Immediately
- Show message when locked: deactivate
- When Switching User:
  - Login window shows: List of users
  - Show the Sleep, Restart and Shut Down buttons: activate
  - Show password hints: deactivate
- Accessibility Options: deactivate all

#### Touch ID & Password
- Touch ID: rename finger and add additional ones
- Use Touch ID to unlock your Mac: activate
- Use Touch ID for Apple Pay: activate
- Use Touch ID for purchases in iTunes Store, App Store and Apple Books: activate
- Use Touch ID for autofilling passwords: activate
- Use Touch ID for fast user switching: activate

#### Users & Groups
Go through the users and remove unnecessary ones. Turn Guest User off.

#### Passwords
I use BitWarden, so nothing to do.

#### Internet Accounts
Check your accounts.

#### Game Center
- Profile Privacy: Only You
- Allow Finding by Friends: deactivate
- Requests from Contacts Only: deactivate
- Nearby Players: deactivate
- Connect with Friends: deactivate

#### Wallet & Apple Pay
- Payment Cards: check or add new ones
- Payment Details: check values
- Compatible Cards: deactivate
- Add Orders to Wallet: activate

#### Keyboard
- Key repeat rate: one before fast
- Delay until repeat: two before short
- Adjust keyboard brightness in low light: activate
- Keyboard brightness: low
- Turn keyboard backlight off after inactivatiy: After 1 Minute
- Press World key to: Show Emoji & Symbols
- Keyboard navigation: activate
- Keyboard shortcuts: I typically leave the defaults, except:
  - Function Keys: Use F1, F2, etc. keys as standard function keys: deactivate
- Input Sources (Edit) - All Input Sources
  - Show Input menu in menu bar: deactivate
  - Correct spelling automatically: deactivate
  - Capitalise words automatically: deactivate
  - Add full stop with double-space: activate
  - Spelling: Automatic by Language
  - Use smart quotes and dashes: deactivate
- Text Replacements: remove everything
- Dictation
  - Use Dictation wherever you can type text: deactivate
  - Language: Add Language German
  - Microphone Source: MacBook Pro Microphone
  - Shortcut: Press Mic
  - Auto-punctuation: activate

#### Mouse
- Tracking speed: 4th tick
- Natural scrolling: activate
- Secondary click: Click Right Side
- Double-Click Speed: 9th tick
- Scrolling Speed: 4th tick

#### Trackpad
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
  - Swipe between pages: Off
  - Swipe between full-screen applications: Swipe Left or Right with Three Fingers
  - Notification Centre: deactivate
  - Mission Control: Swipe Up with Three Fingers
  - App Exposé: Off
  - Launchpad: activate
  - Show Desktop: activate

#### Printers & Scanners
- Default printer: Last Printer used
- Default paper size: A4
- Click on `Add` and add your printer and set your Default printer and paper size

## System extensions (if needed for kernel extensions)
To enable system extensions, you need to modify your security settings in the Recovery environment.
To do this, shut down your system, then press and hold the Touch ID or power button to launch Startup Security Utility. In Startup Security Utility, enable kernel extensions from the Security Policy button.

### Apps that I keep in my dock
I changed the settings for the dock using dockey (see above) and have the following apps in my dock (I remove the other ones by right clicking on the symbol - Options - Remove from Dock; alternatively simply dragging them away from the dock)

- Finder
- Safari
- Messages
- Mail
- Calendar
- Things
- Terminal
- iWriter Pro
- VS Code
- GitKraken
- NoMachine
- Zotero
- LiquidText
- Notability
- MoneyMoney
- Mattermost
- Matlab