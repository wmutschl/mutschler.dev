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

Step 0 also helps you decide between a microSD card and an SSD.
Steps 9 and 10 cover maintenance: updating the firmware of the Zigbee coordinator, and checking the power supply and the Zigbee channel.
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
  For the alternatives, an SSD in particular, see [SD card or SSD?](#sd-card-or-ssd) below.
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

### SD card or SSD?

Before you install, decide where HAOS lives.
Home Assistant writes to its disk all the time: the database, the logs and app updates.
That's what wears out SD cards, and it's why many people move to an SSD.
These are the options:

| Option | Upsides | Downsides |
|---|---|---|
| **microSD card** | Simplest: no extra parts, the [official installation path](https://www.home-assistant.io/installation/raspberrypi/), no load on the USB ports and no extra radio noise near the Zigbee dongle | Wears out; often fails silently, i.e. goes read-only or corrupts data while Home Assistant keeps running; slow at small random writes, especially without an A1 or A2 rating |
| **2.5″ SATA SSD in a USB 3 enclosure** | Built for far more writes, with wear leveling, stronger error correction and SMART health data; much faster at small random writes | Needs an enclosure, whose bridge chip matters; USB 3 gives off radio noise near the Zigbee dongle; uses part of the Pi's USB power budget |
| **NVMe SSD in a USB enclosure** | Same as the SATA SSD | Draws noticeably more power, which can exceed the Pi's USB power budget; no faster than a SATA SSD on the Pi; runs hotter |
| **SD card plus SSD** | **Settings → System → Storage → Move data disk** moves the data, and with it almost all writes, to the SSD; no USB boot needed | Two devices that both have to keep working, plus the USB caveats of the SSD |

**Speed.**
The Pi 4 itself caps what a drive can deliver:

| Connection | Limit on the Pi 4 |
|---|---|
| microSD slot | 50 MB/s (DDR50 bus mode); Raspberry Pi's own A2 cards manage [3,200 random 4 kB reads and 1,200 random 4 kB writes per second](https://www.raspberrypi.com/documentation/accessories/sd-cards.html) |
| USB 2.0 ports (black) | 480 Mbit/s, about 35–40 MB/s in practice, shared by all four ports |
| USB 3.0 ports (blue) | [Over 300 MB/s](https://www.jeffgeerling.com/blog/2019/raspberry-pi-microsd-card-performance-comparison-2019/) in practice, shared by all USB ports, because the USB controller sits on a single PCIe 2.0 lane |

A 2.5″ SATA SSD such as the Samsung SSD 840 (500 GB: up to 540 MB/s read and 330 MB/s write) already reaches that ceiling.
An NVMe SSD that manages several GB/s in a PC gets the same on the Pi.
Sequential speed hardly matters for Home Assistant anyway: its disk work is small random writes, and there any SSD is far ahead of an SD card.
In [Jeff Geerling's tests](https://www.jeffgeerling.com/blog/2020/uasp-makes-raspberry-pi-4-disk-io-50-faster/), a USB 3.0 SSD was ten times faster than the fastest microSD card.

**Power.**
The official power supply delivers 5.1 V at 3 A.
According to [Raspberry Pi](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#power-supply), the Pi 4 itself draws about 0.6 A at idle and up to 1.25 A under full load, and all USB devices together may draw at most 1.2 A, not per port but across all four.
A 2.5″ SATA SSD peaks at roughly 0.5 A (2–3 W) including its enclosure, and the Zigbee dongle needs a few tens of mA.
An NVMe SSD in an enclosure can draw 1 A or more during heavy writes: NVMe drives are built for PCIe slots, where power is plentiful.
On top of that, the enclosure converts the 5 V from USB down to the 3.3 V of M.2 drives, and its bridge chip needs more power than a SATA bridge.
When the drive draws more than the Pi can supply, two different things can go wrong:

1. The input voltage of the Pi drops below 4.63 V: an under-voltage.
2. The voltage at the USB enclosure dips during a current spike, while the input of the Pi stays fine.
   The enclosure or the drive briefly loses power and resets.
   Linux loses the disk that holds the whole system, Home Assistant hangs, and the database or the data partition can be damaged.

The spikes come with heavy writes, e.g. during updates or the nightly backup.
So the Pi runs fine for days and then fails seemingly at random, which looks like a bad drive, cable or enclosure.
[Step 10](#step-10-check-the-power-supply-and-the-zigbee-channel) shows how to check for both cases.

**Zigbee.**
An SSD on a USB 3.0 port is exactly the source of radio noise from the note above.
Keep the dongle on its extension cable, away from the SSD, its enclosure and its cable.
Count the channel access failures of Zigbee2MQTT before and after the move ([Step 10](#step-10-check-the-power-supply-and-the-zigbee-channel)).
If they go up, move the SSD to the other black USB 2.0 port: about 35 MB/s is plenty for Home Assistant, and the noise comes from USB 3.0.

**My take.**
For a Pi that runs around the clock, a 2.5″ SATA SSD in a USB 3 enclosure is the best fit: it fixes the weak spot of the SD card and has none of the drawbacks of NVMe.
An old SSD from the drawer is good enough, once it passes the health check below.
Staying on the SD card until it fails is defensible, as long as the backups are off the Pi ([Step 6](#step-6-encrypted-backups-to-an-smb-share)) and you notice when Home Assistant goes down ([Step 7](#step-7-healthchecksio-heartbeat)).
A dead card then costs at most a day of history, plus the time until you're home to replace it.
But you don't get to choose when that happens, a card that corrupts data silently can spoil the backups made in the meantime, and a spare card of the same kind has the same weakness.

### Booting from a USB SSD

If you go for an SSD, this is what changes compared with the SD card:

1. **Check a used SSD first.**
   On a Linux computer, e.g. with a SATA-to-USB adapter, read its SMART data and run the long self-test:
   ```sh
   lsblk -o NAME,MODEL,SERIAL,SIZE,TRAN   # the SSD shows up with TRAN usb, e.g. as sdc
   sudo smartctl -x /dev/sdc              # shows the model, SMART health and attributes
   sudo smartctl -t long /dev/sdc         # starts the test and prints how long it takes
   sudo smartctl -l selftest /dev/sdc     # afterwards: Completed without error
   ```
   If smartctl reports an unknown USB bridge, or fails with `Read NVMe Identify Controller failed`, add `-d sat` to all three smartctl commands.
   The second error means smartctl mistook the adapter for an NVMe adapter and sent NVMe commands, which a SATA SSD can't answer.
   smartctl goes by the adapter's USB ID, which `lsusb` shows, and some IDs, such as JMicron's `152d:0583` and Realtek's `0bda:9210`, also turn up in adapters for SATA drives.
   Use the SSD only if the overall health says `PASSED`, the raw values of `Reallocated_Sector_Ct`, `Used_Rsvd_Blk_Cnt_Tot`, `Runtime_Bad_Block` and `Uncorrectable_Error_Cnt` are 0, and the normalized value of `Wear_Leveling_Count` is well above 0 (100 means new).
   These are the attribute names on Samsung drives; other brands use similar ones.
2. **Check the bridge chip of the enclosure.**
   Some USB bridges misbehave on the Pi 4 with UAS, the faster USB storage protocol.
   HAOS already turns UAS off for a list of them in the file `cmdline.txt` on its boot partition, including JMicron's JMS578 (SATA) and JMS583 (NVMe) and several ASMedia chips; these just run a bit slower.
   On macOS, `system_profiler SPUSBHostDataType` shows the `USB Vendor ID` and `USB Product ID` of the enclosure (on Linux, `lsusb`).
   Compare them with the `usb-storage.quirks=` list in [HAOS's cmdline.txt](https://github.com/home-assistant/operating-system/blob/dev/buildroot-external/board/raspberrypi/cmdline.txt).
   If an enclosure that isn't on the list causes trouble, like a slow or hanging boot or USB resets, add its `VID:PID:u` to that list, separated by a comma.
   A second `usb-storage.quirks=` would replace the built-in list.
   After flashing, the Mac can read the boot partition; `cmdline.txt` must stay a single line, and HAOS updates keep your changes.
3. **Flash the SSD instead of the SD card**, as in [Step 1](#step-1-flash-home-assistant-os-onto-the-sd-card).
   The Imager lists USB drives as storage, and my script accepts any external disk up to 2 TiB without APFS or HFS+ partitions.
   On the first boot, HAOS grows its data partition to the size of the disk.
4. **Take the SD card out, and never attach two disks with HAOS at the same time.**
   The Pi 4 tries the SD card first, so with the card inserted, the old system starts.
   Worse, HAOS finds its root partition by a partition UUID that is the same on every disk flashed from the image, and its other partitions by their labels.
   A fresh installation even renames the data partition of any other HAOS disk it finds to `hassos-data-dis`, which would ruin the old card as a fallback.
   Keep the card in a drawer instead.
5. **Plug the SSD into a blue USB 3.0 port**, and the Zigbee dongle on its extension cable into a black USB 2.0 port as before.
6. **If the Pi doesn't boot from the SSD**, its bootloader may be too old for USB boot.
   In the Imager, write **Misc utility images → Bootloader → USB Boot** to a spare SD card and boot the Pi from it.
   When the green LED flashes steadily (and a connected screen turns green), unplug the power, take the card out and try again.

To move a running installation to the SSD, create a full backup, shut the Pi down with `ha host shutdown` in the terminal, and restore the backup onto the SSD as in [Step 8](#step-8-restore-from-a-backup).
The old card stays untouched, so you can always go back.

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

## Step 10: Check the power supply and the Zigbee channel

These checks are my benchmark.
I run them after an installation, and before and after every change that could affect power or radio: moving to an SSD, another USB port or cable, a new Wi-Fi channel, or a firmware update of the dongle as in [Step 9](#step-9-update-the-firmware-of-the-zigbee-dongle).

### Under-voltage at the input of the Pi

On a Raspberry Pi, Home Assistant sets up the **Raspberry Pi Power Supply Checker** integration by itself; you find it under **Settings → Devices & services**.
It reads the under-voltage flag of the Pi, which is set when the input voltage drops below about 4.63 V.
Its sensor **Power status** is on the device **Raspberry Pi**, under **Diagnostic**, and shows **Problem** during an under-voltage.
Home Assistant then also raises the repair **Under-voltage detected** under **Settings → System → Repairs**.
The sensor only polls every 30 seconds, though, while the kernel checks the flag every 2 seconds and logs every change.
Short dips therefore often show up only in the kernel log, as `Undervoltage detected!` followed by `Voltage normalised`.
This case catches a weak power supply or cable, and USB devices that draw more than the supply can deliver.

### Brownouts at the USB disk

If the voltage dips only at the USB enclosure, the input of the Pi stays fine, and the Power Supply Checker doesn't notice anything.
All you get are kernel messages about the disk: `USB disconnect`, `reset SuperSpeed … USB device`, errors of the UAS driver (`uas_eh_…`), and I/O errors on `sda`.
If the Pi hangs or reboots, the last messages may be missing, because the log is stored on the disk that went away.

### Read the kernel log

In the browser, open **Settings → System → Logs** and switch from **Home Assistant Core** to **Host**.
In the terminal, this command lists the messages of both cases:
```sh
ha host logs -t kernel -n 10000 | grep -iE 'undervoltage|voltage normalised|usb disconnect|reset superspeed|uas_eh|i/o error'
```
Apart from devices you unplugged yourself, no output is the good result.

### Channel access failures in Zigbee2MQTT

When the coordinator wants to send but finds the channel busy, Zigbee2MQTT logs a `MAC channel access failure`.
A steady stream of them points to radio interference, e.g. from Wi-Fi on an overlapping channel or from USB 3.
Count them in the terminal:
```sh
grep -ric "channel access failure" /homeassistant/zigbee2mqtt/log
```
Zigbee2MQTT creates a new log folder, named by date and time, each time it starts, so you get one count per start.
Note the counts before a change and compare them a few days after it.
Home Assistant backups leave out all `*.log` files, so these logs don't survive a restore onto new hardware or an SSD: write the counts down before you switch.
To see when the failures happened and which devices they hit:
```sh
grep -rih "channel access failure" /homeassistant/zigbee2mqtt/log | tail -n 20
```
Zero is the goal; a few during a burst of activity are harmless.
If the count goes up after a change, undo it, or move the source of the noise further away from the dongle.
