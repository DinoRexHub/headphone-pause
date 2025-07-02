Headphone Pause – GNOME Extension
=================================

A lightweight GNOME Shell extension that automatically pauses and mutes audio when headphones are unplugged, and resumes/unmutes when plugged back in.

Perfect for avoiding unwanted audio blasting through speakers.

Features
--------

- Automatically pauses media via `playerctl`
- Mutes system audio on headphone unplug
- Unmutes audio on replug
- Sends native GNOME notifications
- Fast detection (polls every 0.2 seconds)
- GNOME panel toggle to enable/disable

Installation Instructions
-------------------------

#1. Clone the Repository<br><br>

Open a terminal and run:

git clone https://github.com/YOUR_USERNAME/headphonepause.git
cd headphonepause

Replace `YOUR_USERNAME` with your actual GitHub username.



#2. Install the GNOME Extension

Copy the extension folder to the GNOME extensions directory:

mkdir -p ~/.local/share/gnome-shell/extensions/
cp -r headphonepause@gnome ~/.local/share/gnome-shell/extensions/



#3. Install the Background Script

Copy the headphone detection script to your `~/bin` directory and make it executable:

mkdir -p ~/bin
cp headphone-pause.sh ~/bin/
chmod +x ~/bin/headphone-pause.sh



#4. Create the systemd User Service

Create a systemd service file to run the headphone detection script in the background:

Create the file `~/.config/systemd/user/headphone-pause.service` with the following content:

[Unit]
Description=Pause audio when headphones unplug

[Service]
ExecStart=/home/YOUR_USERNAME/bin/headphone-pause.sh
Restart=on-failure
Environment=DISPLAY=:0
Environment=XDG_RUNTIME_DIR=/run/user/1000

[Install]
WantedBy=default.target

Replace `/home/YOUR_USERNAME` with your actual home directory path and `1000` with your user ID (`id -u`).



#5. Enable and Start the systemd Service

Reload systemd and start the service:

systemctl --user daemon-reload
systemctl --user enable headphone-pause.service
systemctl --user start headphone-pause.service


#6. Enable the GNOME Extension

Enable your extension with:

gnome-extensions enable headphonepause@gnome



#7. Restart GNOME Shell

- On X11: Press Alt + F2, type r, then press Enter
- On Wayland: Log out and log back in

Requirements
------------

- `playerctl` – for media control  
- `libnotify-bin` – for notifications  
- GNOME Shell 42 or higher  
- PulseAudio or PipeWire

Install dependencies with:

sudo apt install playerctl libnotify-bin

Tested On
---------

- GNOME Shell 42.9  
- Pop!_OS 22.04  
- Dell Precision 5550

File Structure
--------------

headphonepause/
├── headphonepause@gnome/       # GNOME extension code
│   ├── extension.js
│   ├── metadata.json
├── headphone-pause.sh          # Headphone detection and pause script
├── README.md                   # This file

