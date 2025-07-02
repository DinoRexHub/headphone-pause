Headphone Pause – GNOME Extension
=================================

A lightweight GNOME Shell extension that automatically pauses and mutes audio when headphones are unplugged, and resumes/unmutes when plugged back in.

Perfect for avoiding unwanted audio blasting through speakers, and it only takes 3 simple steps to install.

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

1. Download the following files and place them in the same folder:<br><br>

- headphone-pause.sh  
- install.sh  
- headphone-pause@gnome (folder containing metadata.json and extension.js)<br><br><br>

2. Open a terminal in that folder and run:<br><br>

bash:
-----

sudo apt install playerctl libnotify-bin<br>
chmod +x install.sh<br> 
./install.sh<br>

This will:
- Copy the headphone-pause.sh script to your ~/bin directory  
- Create and enable the systemd service  
- Enable the GNOME Shell extension  <br><br><br>

3. Restart GNOME Shell:<br><br>

- On X11: press Alt + F2, type r, press Enter  
- On Wayland: log out and log back in  <br><br><br>

That’s it. Headphones will now auto-pause and mute on unplug.<br><br>


Tested On
---------

- GNOME Shell 42.9  
- Pop!_OS 22.04  
- Dell Precision 5550


