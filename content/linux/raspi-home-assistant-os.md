---
title: 'Home Assistant OS on a Raspberry Pi 4: clean install and restore from backup'
summary: >-
  How I install Home Assistant OS on my Raspberry Pi 4 Model B, either from scratch or by restoring a backup.
  It covers my setup with a Sonoff Zigbee 3.0 USB Dongle Plus and Zigbee2MQTT, the apps I use, encrypted backups to an SMB share, a healthchecks.io heartbeat, and how to update the firmware of the Zigbee coordinator.
header:
  image: "raspi.jpg"
  caption: "Image credit: [**https://pxhere.com/en/photo/796221**](https://pxhere.com/en/photo/796221)"
tags: ["linux", "raspberry pi", "home assistant", "home assistant os", "zigbee", "zigbee2mqtt", "install guide", "backup", "healthchecks.io"]
date: 2026-11-16
type: book
---
***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev).
Pull requests are very much appreciated.***
<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

{{< toc hide_on="xl" >}}

## Overview

My Raspberry Pi 4 Model B (4 GB RAM) has exactly one job: it runs [Home Assistant Operating System](https://www.home-assistant.io/installation/raspberrypi/) (HAOS).
In this guide, I cover both ways I set it up:

* **Clean install:** flash HAOS onto a microSD card, go through the onboarding, install the apps, set up Zigbee with a Sonoff Zigbee 3.0 USB Dongle Plus and Zigbee2MQTT, and add backups and monitoring (Steps 0 to 7).
* **Restore from backup:** flash HAOS and restore my latest full backup (Steps 0 to 2, then Step 8).
  This is what I usually do, e.g. when an SD card dies or when I move to new hardware, and it just works.

Step 9 covers a maintenance task: updating the firmware of the Zigbee coordinator.
The script and configuration files I use are in the [Raspberry-Pi-4-Model-B folder of my scripts repository](https://github.com/wmutschl/scripts/tree/main/Raspberry-Pi-4-Model-B).

{{< callout note >}}
I wrote this guide for Home Assistant OS 18.5 and Home Assistant 2026.11.
Home Assistant renamed add-ons to **apps** in 2026.2, so older guides and forum posts still talk about add-ons.
Since 2026.8, a fresh HAOS installation serves its web interface on port 80 instead of 8123.
{{< /callout >}}

## Step 0: Hardware and general remarks

This is my hardware:

* **Raspberry Pi 4 Model B with 4 GB RAM.**
  Home Assistant needs at least 2 GB.
  Use a proper USB-C power supply such as the official one: Home Assistant warns that phone chargers may not be suitable and that the USB ports of a computer must not be used.
* **Silicon Power 32 GB UHS-I Class 10 microSDHC card.**
  Home Assistant recommends at least 32 GB and an *Application Class 2* (A2) card, which handles the many small reads and writes of a running system better.
  My card is not A2 rated, so we will see how reliable it is; I have a spare one just in case.
  The alternatives are to boot directly from a USB SSD, or to keep booting from the SD card and move the data to a USB SSD with **Settings → System → Storage → Move data disk**.
* **Sonoff Zigbee 3.0 USB Dongle Plus** (ZBDongle-P with the Texas Instruments CC2652P chip and a CP210x USB-to-serial bridge) as Zigbee coordinator.
  It sits on a 1.5 meter USB extension cable plugged into one of the black USB 2.0 ports.
* **Ethernet cable** to my FRITZ!Box.
  The installation requires Ethernet; Wi-Fi can be configured afterwards, but Ethernet is highly recommended.
* **A computer with an SD card reader** to flash the card and to do the onboarding in the browser; for me, this is my Mac.

{{< callout note >}}
**Why the extension cable and the USB 2.0 port?**
USB 3.0 ports, cables and attached devices like SSDs give off radio noise in the 2.4 GHz band.
That's the same band Zigbee uses, so they can noticeably cut range and reliability.
This is why [Zigbee2MQTT](https://www.zigbee2mqtt.io/advanced/zigbee/02_improve_network_range_and_stability.html) and Home Assistant both advise against USB 3.
The extension cable also moves the dongle away from the Pi itself.
{{< /callout >}}

## Step 1: Flash Home Assistant OS onto the SD card

### Option A: Raspberry Pi Imager

This is the [official way](https://www.home-assistant.io/installation/raspberrypi/):

1. Install the [Raspberry Pi Imager](https://www.raspberrypi.com/software/), on macOS e.g. with `brew install --cask raspberry-pi-imager`.
2. Insert the SD card and open the Imager.
3. Choose **Raspberry Pi 4** as device, then **Other specific-purpose OS → Home automation → Home Assistant → Home Assistant OS 18.5 (RPi 4/400)** as operating system, and the SD card as storage.
   Don't pick the entries for the Home Assistant Yellow.
4. Write the card.
   There are no customisation settings for HAOS.
   The Imager verifies the card after writing it; afterwards, eject it.

### Option B: Terminal on macOS

If you prefer the terminal, my script [`flash-haos.sh`](https://github.com/wmutschl/scripts/blob/main/Raspberry-Pi-4-Model-B/flash-haos.sh) does the same as the Imager.
It takes the image and its SHA-256 checksums from the metadata that the Imager uses ([rpi-imager-haos.json](https://version.home-assistant.io/rpi-imager-haos.json)), checks the download and the decompressed image, writes the card with `dd` and reads it back to compare.
It refuses internal disks, disks with APFS or HFS+ partitions and disks larger than 2 TiB, and asks you to type the disk identifier before it erases anything.
It needs `xz` (`brew install xz`) and `jq`, which ships with macOS 15 and later.

Find the identifier of the SD card (e.g. `disk5`) by its size:
```sh
diskutil list external physical
```
Then run the script with it:
```sh
git clone https://github.com/wmutschl/scripts.git
./scripts/Raspberry-Pi-4-Model-B/flash-haos.sh disk5
```
It keeps the downloaded image in `~/Library/Caches/flash-haos`, so flashing a spare card right afterwards doesn't download it again.
If macOS shows a dialog that it cannot read the disk, select **Ignore**: HAOS uses filesystems that macOS doesn't know.

## Step 2: First boot and a fixed IP address

1. Insert the SD card into the Pi, connect Ethernet, plug the Zigbee dongle (on its extension cable) into one of the black USB 2.0 ports, and finally connect the power supply.
2. On your computer, open [http://homeassistant.local](http://homeassistant.local).
   If that doesn't load, try `http://homeassistant.local:8123` or the IP address of the Pi, which you find in the router.
   The page should come up within a few minutes; then Home Assistant may show **Preparing Home Assistant** while it downloads the latest version, which can take 20 minutes or more.
3. In the meantime, give the Pi a fixed IP address in the router.
   In the FRITZ!Box, open the device (it shows up as `homeassistant`) under **Home Network → Network → Network Connections**, edit it and turn on the permanent IPv4 address (**Always assign this network device the same IPv4 address**; newer FRITZ!OS versions call it **Assign permanent IPv4 address**).

The reservation is tied to the MAC address of the Pi's Ethernet port, so it survives reflashing the card and restoring backups.
In Home Assistant, I leave the network settings (**Settings → System → Network**) on automatic, with Wi-Fi disabled.

## Step 3: Onboarding

For a clean install, select **Create my smart home** on the welcome screen.
If you want to restore a backup instead, go to [Step 8](#step-8-restore-from-a-backup).

1. Create the owner account with **Name**, **Username** (lowercase, no spaces) and **Password**.
   Store it in your password manager: there is no way to recover the owner credentials.
2. Set your home location by searching the address or with **Detect**, and the country and time zone if asked.
3. Choose what to share on the **Help us help you** screen; everything is off by default.
4. Home Assistant lists the devices and services it found on the network.
   Select **Finish**.

Afterwards, I install pending updates under **Settings → System → Updates** and turn on multi-factor authentication in my user profile under **Security**.

## Step 4: Apps

I install these apps from **Settings → Apps → Install app**:

| App | Repository | What I use it for |
|---|---|---|
| Mosquitto broker | Official | MQTT broker for Zigbee2MQTT |
| Zigbee2MQTT | [zigbee2mqtt/hassio-zigbee2mqtt](https://github.com/zigbee2mqtt/hassio-zigbee2mqtt), see [Step 5](#step-5-zigbee2mqtt-with-the-sonoff-dongle) | Zigbee network with the Sonoff dongle |
| Matter Server | Official | Matter devices |
| Tailscale | Home Assistant Community Apps | Remote access over my tailnet, without opening any ports |
| Advanced SSH & Web Terminal | Home Assistant Community Apps | A shell with the `ha` command line interface |
| Studio Code Server | Home Assistant Community Apps | Editing the YAML files in the browser |

For each app: select it, **Install**, adjust the **Configuration** tab if needed, and **Start**.
On the **Info** tab, I turn on **Start on boot** and **Watchdog**, and **Show in sidebar** for apps with a web interface.
Some notes:

* **Mosquitto broker:** After it has started, Home Assistant discovers the **MQTT** integration under **Settings → Devices & services**; add it.
  Zigbee2MQTT finds the broker on its own.
* **Matter Server:** Add the discovered **Matter** integration afterwards.
  New Matter devices are commissioned with the Home Assistant Companion app on the phone.
* **Tailscale:** Open the web interface of the app and log in to your tailnet.
  From then on, the Companion app reaches Home Assistant over the tailnet from anywhere.
  The [app documentation](https://github.com/hassio-addons/app-tailscale) covers options like sharing Home Assistant over HTTPS within the tailnet.
* **Advanced SSH & Web Terminal:** If you want SSH access in addition to the web terminal, set a username and add your public key to `authorized_keys` in the **Configuration** tab.
  In the terminal, the configuration folder of Home Assistant is `/homeassistant`.

## Step 5: Zigbee2MQTT with the Sonoff dongle

1. Under **Settings → Apps → Install app → ⋮ → Repositories**, add `https://github.com/zigbee2mqtt/hassio-zigbee2mqtt`, then select **Add** and **Close**.
2. Install **Zigbee2MQTT**, not *Zigbee2MQTT Edge*, which follows the development branch.
   Start it and turn on **Start on boot**, **Watchdog** and **Show in sidebar**.
3. Open its web interface.
   On the first start, Zigbee2MQTT shows an onboarding page.
   Under **Found Devices**, select the dongle; this sets the serial port and the adapter type (`zstack` for the ZBDongle-P).
   For my dongle, the port is `/dev/serial/by-id/usb-Silicon_Labs_Sonoff_Zigbee_3.0_USB_Dongle_Plus_0001-if00-port0`.
   Choose a Zigbee channel away from your 2.4 GHz Wi-Fi; the onboarding asks for your Wi-Fi channel to help with that.
   **Submit** and wait: a `502: Bad Gateway` only means Zigbee2MQTT is still starting.
4. Pair devices with **Permit join (All)** in the Zigbee2MQTT interface.
   They show up in Home Assistant through the MQTT integration.

Only one piece of software may use the dongle, so if Home Assistant discovers it for its own Zigbee integration (ZHA) under **Settings → Devices & services**, ignore that discovery.

Zigbee2MQTT keeps its configuration, its device database and the file `coordinator_backup.json` with the network settings (network key, PAN ID, channel) in `/homeassistant/zigbee2mqtt`.
That's part of the configuration folder of Home Assistant, so every Home Assistant backup contains the complete Zigbee network.

## Step 6: Encrypted backups to an SMB share

Keep native full Home Assistant backups off the Pi.
Mine go to an SMB share on my home server, a *Dell Wyse 5070 Thin Client* with Ubuntu.
The server snapshots them hourly with BTRFS, sends them to an encrypted HDD every night, and mirrors them off-site to a Hetzner Storage Box.
Home Assistant encrypts its backups with its own key, so neither the share nor the off-site copy ever holds readable data.
On the server side, it's a single SMB 3 share `ha-backups` for a single account `hass-backup`, which accepts only the Pi; see the [smb.conf](https://github.com/wmutschl/scripts/blob/main/Dell-Wyse-Thin-Client-5070/etc/samba/smb.conf) in my scripts repository.
Any NAS with SMB or NFS works the same way.

In Home Assistant:

1. **Settings → System → Storage → Add storage**: Name `dell_wyse` (only letters, digits and underscores are allowed), usage **Backup**, type **Samba/Windows (CIFS)**, the IP address of the server, remote share `ha-backups`, and username and password of the share.
   Select **Connect**.
   If it asks for a CIFS version, keep **Auto (2.1+)**.
2. **Settings → System → Backups → Set up backups** (later: **Configure backup settings** on the **Automatic backup** card), then **Custom**.
   My settings:
   - **Schedule:** daily at **System optimal** time, which is between 04:45 and 05:45.
     As preference when updating: **Backup before update**.
   - **Retention:** 7 backups.
   - **Backup data:** the Home Assistant settings (always included), the history and all apps.
     Media and the share folder stay off; turn them on if you keep camera recordings or app data there.
   - **Locations:** **This system**, for quick restores on the Pi, and `dell_wyse`.

   The cog next to a location opens its own retention and encryption settings.
   On **This system**, I keep 60 backups; at about 40 MB each, they are cheap, but they die with the SD card.
   `dell_wyse` uses the global 7, since the server's snapshots keep older ones for months anyway.
   Both locations should say *Backups made to this location will be encrypted*.
3. On the **Encryption key** card, select **Download emergency kit** and store the file in your password manager.
   Without this key, the backups are useless.
4. Create the first backup right away with **Backup now → Manual backup**, with **Apps** set to **All**, and check that it arrives on the server:
   ```sh
   # on the server
   sudo ls -lh /srv/ha-backups
   ```

When an upload fails, Home Assistant shows a repair (*Automatic backup could not be uploaded to the configured locations*) under **Settings → System → Repairs**.
My server additionally checks every morning that a backup newer than 26 hours has arrived, and otherwise alerts me through healthchecks.io ([dell-wyse-ha-backup-check](https://github.com/wmutschl/scripts/blob/main/Dell-Wyse-Thin-Client-5070/usr/local/sbin/dell-wyse-ha-backup-check)).
That also catches a dead Pi, which nothing on the Pi could report.

## Step 7: healthchecks.io heartbeat

I want to know when Home Assistant itself is down.
So Home Assistant pings a check on [healthchecks.io](https://healthchecks.io) every minute, and healthchecks.io alerts me when the pings stop.
I keep the REST command and the automation together in a [package](https://www.home-assistant.io/docs/configuration/packages/), which is a single file that I can keep in my scripts repository.
The files below are in the configuration folder of Home Assistant, which is `/homeassistant` in the web terminal; I edit them with Studio Code Server.

1. Create a check on healthchecks.io, e.g. with a period of 1 minute and a grace time of 5 minutes, and copy its ping URL.
2. Add the ping URL to `secrets.yaml`, so it stays out of the configuration files:
   ```yaml
   healthchecks_ping_url: "https://hc-ping.com/<uuid-of-the-check>"
   ```
3. Enable packages in `configuration.yaml`; if there is a `homeassistant:` section already, add the `packages:` line to it:
   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```
   Studio Code Server underlines `packages` with a *patternWarning*.
   That's a false positive of its Home Assistant extension; the line is exactly what the [documentation](https://www.home-assistant.io/docs/configuration/packages/) says.
4. Create the file `packages/healthchecks.yaml` (with `.yaml`, because `!include_dir_named` silently skips `.yml` files) with the content of my [healthchecks.yaml](https://github.com/wmutschl/scripts/blob/main/Raspberry-Pi-4-Model-B/homeassistant/packages/healthchecks.yaml):
   ```yaml
   rest_command:
     healthchecks_ping:
       url: !secret healthchecks_ping_url
       method: get

   automation:
     - id: healthchecks_ping
       alias: Healthchecks Ping
       description: Ping healthchecks.io every minute
       triggers:
         - trigger: time_pattern
           minutes: "*"
       conditions: []
       actions:
         - action: rest_command.healthchecks_ping
       mode: single
   ```
5. Check the configuration with `ha core check` in the web terminal; it reports either success or the errors.
   Then restart Home Assistant with **Settings → ⋮ → Restart Home Assistant**.
   Afterwards, healthchecks.io should get a ping every minute, and the traces of the automation *Healthchecks Ping* show every run.

{{< callout note >}}
If you prefer the automation editor, put the **rest_command** section into **configuration.yaml** instead, create a new automation, switch to **Edit in YAML** and paste the automation from above without its **id** line.
{{< /callout >}}

## Step 8: Restore from a backup

This is the path for a dead SD card, a move to other hardware, or a fresh start with the old configuration.

### What you need

* **A full backup**, i.e. the `.tar` file.
  Mine are on the share of my home server, from where I copy the newest one to my Mac.
  The directory belongs to the Samba account, so the copy takes a detour through my home directory on the server:
  ```sh
  # list the newest backups (dell-wyse is my home server)
  ssh -t dell-wyse 'sudo ls -t /srv/ha-backups | head -n 3'
  # automatic_backup_2026_11_2_2026-11-17_15.12_27439464.tar
  # automatic_backup_2026_11_1_2026-11-17_12.49_48712075.tar
  # automatic_backup_2026_11_1_2026-11-17_05.42_26004763.tar

  # copy the newest one to the Mac; use the name from your list
  ssh -t dell-wyse 'sudo install -m 0600 -o "$(id -u)" -g "$(id -g)" /srv/ha-backups/automatic_backup_2026_11_2_2026-11-17_15.12_27439464.tar ~/'
  scp dell-wyse:automatic_backup_2026_11_2_2026-11-17_15.12_27439464.tar ~/Downloads/
  ssh dell-wyse 'rm ~/automatic_backup_2026_11_2_2026-11-17_15.12_27439464.tar'
  ```
  If the old system still runs, you can also download a backup in its web interface under **Settings → System → Backups → Show all backups**.
* **The encryption key** from the emergency kit.
  A backup downloaded through the web interface is decrypted on the fly by default and needs no key.
* **Enough space:** the new card needs more free space than the old system used, plus 2 GB.
  In the terminal, `ha host info` shows the usage as `disk_used`; mine uses 9.1 GB of the 28.6 GB that HAOS gets on the 32 GB card.
* **Only one Home Assistant at a time:** if the old system still runs, shut it down first.
  Otherwise both would control the same Matter devices and cloud integrations, and claim the same machine in the tailnet.

### Restore during the onboarding

1. Flash and boot as in [Step 1](#step-1-flash-home-assistant-os-onto-the-sd-card) and [Step 2](#step-2-first-boot-and-a-fixed-ip-address), with the Zigbee dongle in the same USB 2.0 port as before.
   On the same Pi, the FRITZ!Box hands out the same IP address.
   On a different Pi, move the reservation to the new device.
2. On the welcome screen, select **Upload backup** below **Or restore**, then **Select backup file** and choose the `.tar` file.
3. Select all parts of the backup, enter the encryption key from the emergency kit and select **Restore backup**.
4. Wait while Home Assistant restores the backup and downloads all apps again; on my Pi 4, this takes about 10 minutes.
   The page may lose its connection in between.
   The restored system uses the web server port of the old one, so if `http://homeassistant.local` stops responding after the restore, try `http://homeassistant.local:8123`, the default of installations from before Home Assistant 2026.8.
   Mine came back on 8123, and I then switched it to 80 under **Settings → System → Network → HTTP server**.
   Confirm the new port within 5 minutes, otherwise Home Assistant reverts to the old one.
   Afterwards, update the server address in the Companion app and, if you share Home Assistant with the Tailscale app, restart that app.
5. Log in with your old account.

{{< callout note >}}
**Alternative without copying the backup:** On the welcome screen, select **Create my smart home** with a throwaway account, add the network storage exactly as in [Step 6](#step-6-encrypted-backups-to-an-smb-share), with the same name, and open **Settings → System → Backups → Show all backups**.
Select the newest backup on that location, select everything under **Select what to restore**, enter the encryption key and select **Restore**.
The restore replaces the throwaway account and all settings, including the network storage.
{{< /callout >}}

### Checks after the restore

* **Settings → Apps:** all apps are back and running.
  In the logs of Mosquitto and Zigbee2MQTT, the broker accepts connections and the coordinator has started.
  Zigbee2MQTT may first log `ENOTFOUND core-mosquitto` while Mosquitto is still starting, which is fine if it connects afterwards.
* Switch a mains-powered Zigbee device.
  Battery-powered devices report in when they wake up.
* Matter devices respond, and Tailscale shows the Pi as online: its state is part of the backup, so it rejoins the tailnet as the same machine.
* **Settings → System → Storage:** the network storage is connected again; the backup includes it.
* **Settings → System → Backups:** the automatic backups are set up as before.
  The encryption key comes back with the restored settings, so the emergency kit in your password manager stays valid; for me, the key was the same.
  Under **Configure backup settings**, the cog next to each location should say *Backups made to this location will be encrypted*.
  If it shows a **Turn on** button instead, turn it on, in particular for **This system**.
* The uploaded backup stays on **This system** as a manual backup, and the retention never deletes manual backups.
  If you downloaded it through the web interface, it is not encrypted either.
  Delete it under **Settings → System → Backups → Show all backups** once the restored system has made its own backups.
  To see which backups are encrypted where, run this in the terminal:
  ```sh
  ha backups --raw-json | jq -r '.data.backups | sort_by(.date)[] | "\(.date[:16])  \(.name):  " + ([.location_attributes | to_entries[] | "\(.key) \(if .value.protected then "encrypted" else "NOT encrypted" end)"] | join(", "))'
  # 2026-11-14T14:38  Migration_To_Pi:  .local NOT encrypted
  # 2026-11-15T04:24  Automatic backup 2026.11.1:  .local encrypted
  # ...
  # 2026-11-17T04:42  Automatic backup 2026.11.1:  .local encrypted, dell_wyse encrypted
  ```
* healthchecks.io receives pings again.
* Finally, create a manual backup and check that it lands on the share.

## Step 9: Update the firmware of the Zigbee dongle

Check the current coordinator firmware of the dongle (`zStack3x0`) in the Zigbee2MQTT interface under **Settings → About**: the coordinator version shows the revision, e.g. `20240710`.
Compare this with the latest version in the [changelog of Koenkk/Z-Stack-firmware](https://github.com/Koenkk/Z-Stack-firmware/blob/master/coordinator/Z-Stack_3.x.0/CHANGELOG.md); as of November 2026, the latest coordinator firmware for the CC2652P is 20250321.

### Backup first

1. In Zigbee2MQTT, go to **Settings → Tools** and select **Request Z2m backup**.
   Wait a couple of seconds, then select **Download Zigbee2MQTT backup** and save the zip file on your computer.
2. In Home Assistant, create a backup with **Settings → System → Backups → Backup now → Manual backup**.
   Make sure that **Apps** is set to **All**, select **Next**, give it a name and select **Create backup**.
   When it has finished, download it under **⋮ → Download**.
3. In the web terminal, check that `coordinator_backup.json` exists and is recent:
   ```sh
   stat -c '%y' /homeassistant/zigbee2mqtt/coordinator_backup.json
   # 2026-11-15 12:14:33.621662213 +0100
   ```

### Stop Zigbee2MQTT

1. In Home Assistant, go to **Settings → Apps → Zigbee2MQTT** and select **Stop**.
2. Temporarily turn off **Watchdog** and **Start on boot** for the app, so Home Assistant doesn't try to start it while the dongle is gone.
3. If ZHA is set up, make sure it is disabled.
   Only one thing may use the dongle.

### Flash the firmware with the SONOFF Dongle Flasher

This needs a computer with Chrome or Edge, because the flasher uses Web Serial; Firefox and Safari don't support it.
The alternative is [cc2538-bsl](https://github.com/JelmerT/cc2538-bsl), which is more reliable but also more involved.

1. Unplug the dongle from the Raspberry Pi and plug it into your computer.
2. Open the [SONOFF Dongle Flasher](https://dongle.sonoff.tech/sonoff-dongle-flasher/) in Chrome or Edge and select **Connect**.
   On Windows, install the Silicon Labs CP210x USB-to-UART driver if no COM port shows up.
3. Select the port of the **Sonoff Zigbee 3.0 USB Dongle Plus** (on macOS, `cu.usbserial-…`), then **Connect** and **Allow**.
4. Check what the flasher shows:
   - `Current Device: ZBDongle-P` means that it detected the dongle correctly.
   - `Current FW: Zigbee NCP 20240710` matches the firmware Zigbee2MQTT reported, so the flasher reads the dongle properly.
   - `Upgrade To: Zigbee NCP 20250321, Stable` is the newest coordinator firmware.
     *Zigbee NCP* is SONOFF's name for the coordinator firmware.
     Don't pick the *Router* firmware under *Change firmware*.
   - `Baudrate 115200` is the standard rate and works with Zigbee2MQTT.
5. Start **Flash** and wait until it reports success.
   Don't unplug the dongle while it runs.
6. Unplug the dongle from your computer.

### Put it back and start Zigbee2MQTT

1. Plug the dongle back into the same black USB 2.0 port of the Pi, on its extension cable.
2. In Home Assistant, go to **Settings → Apps → Zigbee2MQTT** and select **Start**.
3. Turn **Watchdog** and **Start on boot** back on.

### Check that it worked

* The log shows that Zigbee2MQTT restored the coordinator from its backup (on the first start after flashing, which erased the network settings on the dongle) and a line like ``Coordinator firmware version: '{"meta":{…"revision":20250321…},"type":"zStack3x0"}'``.
* The Zigbee2MQTT interface shows **20250321** under **Settings → About**.
* Toggle a few mains-powered devices like lights and plugs.
  Battery devices may take a while to report in again; that's normal.
