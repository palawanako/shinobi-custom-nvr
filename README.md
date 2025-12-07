# TAMEYE – Customized Shinobi-Based NVR  
### Based on Shinobi (Open Source CCTV Software)

This repository contains **TAMEYE**, a heavily customized and production-ready system built on top of the open-source [Shinobi NVR](https://shinobi.video/) platform.

TAMEYE extends Shinobi with new features for enterprise video management, multi-camera operations, Persian localization, user management, storage automation, and deep UI/UX improvements.

This repository is **not an official Shinobi project**.  
All original Shinobi code belongs to its author **Moe Alam** and the Shinobi team.

---

# 📌 About Shinobi (Upstream Project)

Shinobi is the open source CCTV/NVR solution written in Node.js. It features:

- Multi-account system  
- WebSocket streaming, HLS, MJPEG  
- Region motion detection  
- Recording to WebM and MP4  
- Sub-accounts with permissions  
- API for video/monitor control  
- Modern dashboard with Material Design Lite, jQuery, Bootstrap  
- FFprobe-based stream analyzer  
- And much more…

Full details, documentation, and support:  
👉 https://shinobi.video

---

# 🚀 What This Repository Is

**TAMEYE is a customized and extended version of Shinobi**, designed to support:

- Large multi-camera deployments  
- Persian/Farsi language and Jalali calendar  
- Advanced storage and cleanup automation  
- Multi-viewer playback and timeline navigation  
- Operator-friendly interface for daily monitoring  
- Enterprise-level user & group management  
- Heavy UI/UX improvements  
- Dozens of practical bug fixes, optimizations, and new tools

These features were developed over several years as part of a real-world NVR deployment.

---

# 🔧 Major Enhancements in TAMEYE

Below is a structured, professional summary of all the features created.

---

## 1. **Smart Storage & Video Cleanup**

- Priority-based video deletion per camera  
- Stored procedure to clean expired videos and sync filesystem with DB  
- Automatic cleanup when disk approaches full  
- Limits for row deletions in cleanup operations  
- Improved logic for group-based purge actions  
- Storage usage calculation & live front-end visualization  

**Result:**  
TAMEYE remains stable for months/years under heavy recording loads.

---

## 2. **Camera Management Improvements**

- Camera list redesigned with IP, row numbers, status icons, and camera type (ONVIF-integrated)  
- Sidebar camera list view with icons and live status indicators  
- Sortable camera list with permission-based actions  
- Bulk group actions (e.g., change recording mode for selected cameras)  
- Export camera details as **CSV** or formatted **JSON**  
- Copy camera configuration with IP visible for technicians  
- Department-based organization system  
- PTZ controls: zoom + rotate  
- New reconnect timers and improved camera status display  

**Result:**  
Monitoring dozens/hundreds of cameras becomes much easier.

---

## 3. **User, Group & Department Management**

A full administrative system built on top of Shinobi:

- Add / edit / delete users  
- Manage user groups and permissions  
- Department assignment and cleanup  
- Collapsible camera lists inside admin panel  
- Change-password module  
- Fixes for permission reload issues and undefined values  

**Result:**  
Multi-operator environments (control rooms, security teams) become manageable.

---

## 4. **Video Playback, Multi-Playback & Stream Controls**

TAMEYE elevates Shinobi's playback system:

- Multi-camera playback view  
- Timeline date-range improvements  
- Jalali calendar date conversion in video lists  
- Live stream switching (main/sub stream toggle)  
- Player resizing controls  
- Digital zoom in live streams  
- Playback preview + fullscreen enhancements  
- Timelapse improvements and bug fixes  

**Result:**  
Operators can analyze events across multiple cameras quickly and efficiently.

---

## 5. **Localization, RTL Support & UI Enhancements**

### Persian / RTL Features  
- Full Persian (Farsi) language support  
- Jalali (Shamsi) date system using Moment.js  
- FullCalendar RTL + language fixes  
- RTL notification and UI translation  
- Persian sub-description values  
- Styled login page and home page, with Vazir font  

### General UI / UX Improvements  
- New **TAMEYE** theme  
- Styled menus, hover effects, camera grids  
- Scrollbar fixes (including Mozilla-specific CSS)  
- Better icons, improved notification display  
- Graphical camera view improvements  

**Result:**  
A modern, operator-friendly interface suitable for daily surveillance work.

---

## 6. **API Extensions & Integrations**

### Screenshot API
- Capture PNG images  
- Store and display screenshots in the UI  
- Automatic directory creation  

### Video Conversion API
- Convert MP4 → TS for Desktop/low-bandwidth playback  
- Temporary TS files removed automatically

### TAMEYE Operational APIs
- `getAllCameraStart`  
- `tamevents`, `tamevent`  
- `tamcountCams`, `tamcountUser`, `tamcountmode`  
- `tamCheckDisk`  
- Additional server–client communication APIs  

**Result:**  
The system integrates with dashboards, Desktop apps, and operations tooling.

---

## 7. **System Health & Monitoring Enhancements**

- RAM usage fixes (correct parsing via `free -m`)  
- Real-time process review and health display  
- Resource manager improvements  
- More reliable socket updates  

---

# 🧱 Tech Stack

- **Base:** Shinobi NVR (Node.js)  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL / MariaDB  
- **Video Engine:** FFmpeg (with custom flags + stream tuning)  
- **Frontend:** Shinobi’s UI with extended HTML, CSS, JavaScript  
- **Localization:** Moment.js, FullCalendar, Jalali support  
- **APIs:** Custom REST-like endpoints  

---

# 📦 Installation (High-Level)

TAMEYE is built on top of a Shinobi installation.

1. Install Shinobi (see official docs):  
   https://shinobi.video/docs/start  
2. Clone this repository on top of your Shinobi directory:
   ```bash
   git clone https://github.com/palawanako/shinobi-custom-nvr.git
