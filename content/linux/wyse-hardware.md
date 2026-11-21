---
title: 'Dell Wyse 5070 Thin Client: RAM and SSD upgrade, BIOS update and BIOS settings for a home server'
summary: >-
  How I prepared my Dell Wyse 5070 Thin Client as a home server: 32 GB RAM and a 2 TB M.2 SATA SSD, a BIOS update from a USB flash drive, and every BIOS setting I go through, from AHCI and Secure Boot to AC Recovery, Wake on LAN and the admin password.
  This is the hardware part; my guide on Ubuntu Server 26.04 LTS, BTRFS and Nextcloud AIO continues from here.
header:
  image: "dell-wyse-5070.jpg"
  caption: "Image credit: [**-stk**](https://commons.wikimedia.org/wiki/File:Dell_Wyse_5070_03.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via Wikimedia Commons"
tags: ["linux", "dell wyse", "thin client", "home server", "hardware", "ram", "ssd", "bios", "uefi", "secure boot", "install guide"]
date: 2026-11-17
type: book
---
***Please feel free to raise any comments or issues on the [website's Github repository](https://github.com/wmutschl/mutschler.dev).
Pull requests are very much appreciated.***
<a href="https://www.buymeacoffee.com/mutschler" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

{{< toc hide_on="xl" >}}

## Overview

{{< figure src="dell-wyse-5070.jpg" id="dell-wyse-5070" alt="A Dell Wyse 5070 Thin Client seen from the front and side" caption="A Dell Wyse 5070 Thin Client. Image credit: [**-stk**](https://commons.wikimedia.org/wiki/File:Dell_Wyse_5070_03.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via Wikimedia Commons" >}}

My Dell Wyse 5070 Thin Client is my home server.
Before installing anything on it, I upgrade the RAM and the SSD, flash the latest BIOS and go through the BIOS settings once from top to bottom.
This guide covers exactly these three steps:

1. **Upgrade RAM and SSD** ([section 1](#1-upgrade-ram-and-ssd)).
2. **Flash the latest BIOS** from a USB flash drive ([section 2](#2-flash-the-latest-bios)).
3. **Go through the BIOS settings** ([section 3](#3-go-through-the-bios-settings)), menu by menu.

Afterwards, the Wyse is ready for a fresh installation.
Mine continues with my guide [Ubuntu Server 26.04 LTS, BTRFS and Nextcloud AIO with a Tailscale sidecar](/linux/wyse-ubuntu-nextcloud-aio/), which installs Ubuntu on an encrypted BTRFS SSD and runs Nextcloud All-in-One on it.

This is my hardware:

* **Dell Wyse 5070 Thin Client** with an Intel Celeron J4105 (4 cores) and no Wi-Fi card.
* **Corsair Vengeance SODIMM 32 GB (2x16 GB) DDR4 2400 MHz CL16** as the new RAM.
* **Verbatim Vi560 S3 2 TB SSD**, SATA III, M.2 2280, as the new system disk.
* **A USB flash drive** for the BIOS update; a small one is enough.
* **A monitor and a keyboard** for the BIOS setup.

## 1 Upgrade RAM and SSD

I replace the RAM with the two 16 GB Corsair modules, one per SODIMM slot, and put the 2 TB Verbatim SSD into the M.2 slot for SATA SSDs; NVMe SSDs don't work in it.
The built-in 32 GB eMMC stays where it is; I won't need it.
Of the 32 GB of RAM, Linux uses only about 30 GB: the BIOS's memory type range registers (MTRRs) don't cover the top 2 GB, so the kernel leaves them unused and logs `WARNING: BIOS bug: CPU MTRRs don't cover all of memory, losing 2048MB of RAM` at every boot.
That is harmless and costs only a little page cache; disabling SGX ([section 3.6](#36-intel-software-guard-extensions)) doesn't change it either.

{{< callout note >}}
**Be patient after the RAM upgrade.**
The Wyse sometimes takes a while to restart.
Just be patient for a couple of minutes.
{{< /callout >}}

## 2 Flash the latest BIOS

1. Download the latest **Dell Wyse 5070 Thin Client System BIOS** from [Dell's support page for the Wyse 5070](https://www.dell.com/support/home/en-us/product-support/product/wyse-5070-thin-client/drivers).
   For me, it is currently version **1.40.0** from 10 Dec 2025.
2. Format a USB flash drive with **FAT32**.
3. Copy the downloaded EXE file onto the USB flash drive.
4. Connect the USB flash drive to the Wyse and switch it on.
   Keep hitting **F12** to enter the **One-Time Boot Menu** and select **BIOS Flash Update**.
5. Select the BIOS update file on the USB flash drive and click **Begin Flash Update**.
   The Wyse flashes the new BIOS and restarts; don't cut the power while it is flashing.

{{< callout note >}}
**Formatting the USB flash drive on a Mac.**
In Disk Utility, choose **View → Show All Devices**, select the USB flash drive itself and erase it with the format **MS-DOS (FAT)** and the scheme **Master Boot Record**.
Or in the terminal:

```sh
# Find the USB flash drive, e.g. /dev/disk4, and double-check its size and name
diskutil list external

# Erase it with FAT32 and an MBR partition table (replace disk4 with your disk)
diskutil eraseDisk FAT32 WYSEBIOS MBRFormat /dev/disk4
```

`eraseDisk` **erases** the whole disk you name, so check the identifier twice.
{{< /callout >}}

## 3 Go through the BIOS settings

Restart the Wyse and keep hitting **F2** to enter the BIOS setup.
The subsections below follow the menu groups on the left, from top to bottom.
I leave everything not mentioned as it is.
On a used Wyse, the settings may be locked: click **Unlock** and enter the admin password, which is `Fireport` by default on Dell Wyse thin clients; [section 3.4](#34-security) replaces it with your own.
When you are done, click **Apply** to save the settings and **Exit** to restart.

### 3.1 General

| Page | Setting | Note |
|---|---|---|
| **System Information** | Check the **BIOS Version** | For me, 1.40.0 after the update from [section 2](#2-flash-the-latest-bios) |
| | Check **Memory Installed**, **SODIMM1** and **SODIMM2** | Both new 16 GB modules show up, 32 GB in total |
| | **PCI Information** | Empty; I don't need this |
| | **Primary Hard Drive** | 2048 GB: the new SSD |
| | **EMMC Device** | 32 GB: the built-in eMMC, which I won't need |
| | **Wi-Fi** and **Bluetooth** | None |
| **Boot Sequence** | Delete all **Boot Options** | I do a fresh install, and the Ubuntu installer adds its own boot option later |
| **UEFI Boot Path Security** | **Always, Except Internal HDD** | With the admin password from [section 3.4](#34-security), the Wyse asks for that password before it boots anything but the internal SSD from the F12 menu, e.g. an installer USB stick |

### 3.2 System Configuration

| Page | Setting | Note |
|---|---|---|
| **UEFI Network Stack** and **UEFI HTTP Boot** | Deactivate **Enable UEFI Network Stack** and **UEFI HTTP Boot** | I don't boot over the network |
| **Integrated NIC** and **2nd NIC (RJ-45/SFP)** | **Enabled** | Plain Ethernet, without network boot |
| **Serial Port** | **Disabled** | Not needed |
| **SATA Operation** | **AHCI** | |
| **Drives** | Enable **SATA-0** | Check its **Type** (2048 GB) and **Device ID** (Verbatim Vi560) |
| **SMART Reporting** | Activate **Enable SMART Reporting** | The BIOS reports SMART errors of the SSD at startup |
| **USB Configuration** | Activate **Enable USB Boot Support**, **Enable Front USB Ports** and **Enable Rear USB Ports** | USB boot is needed for the installer USB stick |
| **Front USB Configuration** and **Rear USB Configuration** | Enable all ports | The backup HDDs and the installer USB stick use them |
| **USB PowerShare** | Deactivate **Enable USB PowerShare** | I don't need to charge devices while the Wyse is powered off |
| **Audio** | Disable the **Audio** controller, the **Microphone** and the **Internal Speaker** | A server needs no sound |

### 3.3 Video

| Page | Setting | Note |
|---|---|---|
| **Primary Display** | **Auto** | |

### 3.4 Security

| Page | Setting | Note |
|---|---|---|
| **Admin Password** | Set a new password | Protects the BIOS settings; store it in your password manager |
| **System Password** | **Not Set** | No password at power-on, so that the Wyse boots on its own, e.g. after a power outage |
| **Internal HDD-0 Password** | **Not Set** | Not needed; my system SSD is encrypted with LUKS anyway ([section 3 of the Nextcloud guide](/linux/wyse-ubuntu-nextcloud-aio/#3-install-ubuntu-on-an-encrypted-system-disk)) |
| **UEFI Capsule Firmware Updates** | Activate **Enable UEFI Capsule Firmware Updates** | Allows BIOS updates from UEFI capsule packages, e.g. through fwupd and the LVFS on Linux |
| **PTT Security** | Enable only **PTT On** | Intel Platform Trust Technology, the firmware TPM 2.0 |
| **Chassis Intrusion** | **On-Silent** | Detects an opened case without a warning at startup |

Make sure **Admin Setup Lockout**, **Master Password Lockout**, **SMM Security Mitigation** and **Password Jumper** are disabled.

### 3.5 Secure Boot

| Page | Setting | Note |
|---|---|---|
| **Secure Boot Enable** | Activate **Secure Boot Enable** | Ubuntu boots with Secure Boot, through its signed shim, GRUB and kernel |
| **Secure Boot Mode** | **Deployed Mode** | Enforces the signature checks; **Audit Mode** would only check them without blocking anything |
| **Expert Key Management** | **PK** selected, **Enable Custom Mode** stays off | The factory keys (PK, KEK, db and dbx) stay in place |

### 3.6 Intel Software Guard Extensions

| Page | Setting | Note |
|---|---|---|
| **Intel SGX Enable** | **Disabled** | The BIOS locks SGX's launch control, so Linux can't run its own enclaves anyway and logs `SGX Launch Control is locked. Support SGX virtualization only`; disabling SGX gives back 256 MB of RAM that it would otherwise reserve |
| **Enclave Memory Size** | No change | Only applies with SGX enabled |

### 3.7 Performance

| Page | Setting | Note |
|---|---|---|
| **Multi Core Support** | **All** | All four cores |
| **Intel SpeedStep** | Activate **Enable Intel SpeedStep** | Lower clock speed when idle |
| **C-States Control** | Activate **C states** | Deeper sleep states of the idle CPU |
| **Intel TurboBoost** | Activate **Enable Intel TurboBoost** | Higher clock speed under load |

### 3.8 Power Management

| Page | Setting | Note |
|---|---|---|
| **AC Recovery** | **Power On** | The Wyse starts again after a power outage; with my encrypted SSD, it then waits for the [SSH unlock](/linux/wyse-ubuntu-nextcloud-aio/#57-unlocking-the-system-disk-over-ssh) |
| **Auto On Time** | **Every Day** at **1 AM** | Switches the Wyse on if it was powered off |
| **Deep Sleep Control** | **Disabled** | Wake on LAN does not work from deep sleep |
| **Fan Control Override** | Deactivate **Fan Control Override** | |
| **USB Wake Support** | Activate **Enable USB Wake Support** | A USB keyboard can wake the Wyse from standby |
| **Wake on LAN** | **LAN Only** | |
| **Wake on 2nd NIC** | **Disabled** | |
| **Block Sleep** | Deactivate **Block Sleep** | |

### 3.9 POST Behavior

| Page | Setting | Note |
|---|---|---|
| **Adapter Warnings** | Deactivate **Enable Adapter Warnings** | |
| **Numlock LED** | Deactivate **Enable Numlock LED** | |
| **Keyboard Errors** | Activate **Enable Keyboard Error Detection** | |
| **Fastboot** | **Thorough** | Complete hardware and configuration initialization at every boot |
| **Extend BIOS POST Time** | **0 seconds** | |
| **Full Screen Logo** | Deactivate **Enable Full Screen Logo** | |

### 3.10 Virtualization Support

| Page | Setting | Note |
|---|---|---|
| **Virtualization** | Activate **Enable Intel Virtualization Technology** | |
| **VT for Direct I/O** | Activate **Enable VT for Direct I/O** | |

### 3.11 Wireless

| Page | Setting | Note |
|---|---|---|
| **Wireless Device Enable** | Deactivate **WLAN/BT** | My Wyse has no Wi-Fi card |

### 3.12 Maintenance

No changes required: **SERR Messages**, **BIOS Downgrade** and **BIOS Recovery from Hard Drive** are enabled.

## 4 Next steps

The Wyse is now ready for a fresh installation; mine continues with [section 2 of my Nextcloud guide](/linux/wyse-ubuntu-nextcloud-aio/#2-preparations), which boots the Ubuntu Server installer from a USB stick with **F12**.
Because of **UEFI Boot Path Security**, the Wyse asks for the admin password from [section 3.4](#34-security) before it boots the USB stick.
