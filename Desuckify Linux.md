# Make linux suck less

## Install and enable SSH
```bash
sudo apt update
sudo apt upgrade
sudo apt install ssh
sudo systemctl enable ssh
```

Enable rule in firewall:

```bash
sudo ufw allow ssh
sudo ufw enable
```


## Give sudo a reasonable timeout

```bash
cd /etc/sudoers.d
sudo visudo -f myusername
```

Add line (this is a timespan in minutes):

```
Defaults	timestamp_timeout=100
```

Save the file (will save with filename specified as whatever is used in place of myusername)


## Enable bare hostname resolution (without .local)
This solution seems to work, and survives a reboot:

```bash
sudo mkdir -p /etc/systemd/resolved.conf.d/
```

Then make the file:

```bash
sudo nano /etc/systemd/resolved.conf.d/90-disable-stub-listener.conf
```
Give it file contents:

```
[Resolve]
DNSStubListener=no
```

Then restart the service to apply the change:

```bash
sudo systemctl restart systemd-resolved
```

And now it should be possible to resolve bare hostnames:

```bash
ping t440x
```


## Install and configure Samba file sharing
```bash
sudo apt update
sudo apt upgrade
sudo apt install samba
sudo systemctl enable smbd
```

To configure a shared folder for all-network access at /shared:

```bash
sudo mkdir /shared
sudo chown nobody /shared
sudo chgrp nogroup /shared
sudo chmod ugo+rwx /shared

sudo nano /etc/samba/smb.conf
```

Add contents to bottom of file:
```
[shared]
path = /shared
browseable = yes
public = yes
guest ok = yes
read only = no
force user = nobody
create mask = 777
```

Also add this to the `[global]` section:
```
security = user
```

Then restart smbd:
```bash
sudo systemctl restart smbd
```

Enable the traffic through the firewall:
```bash
sudo ufw allow 'Samba'
```

This sort of seems to work.  Connecting from windows clients still sometimes prompts for a username/password, but any phony credentials are accepted.


## Snapper
First, get rid of the stupid shutter sound when taking a screenshot by renaming the sound file:

```
sudo mv /usr/share/sounds/freedesktop/stereo/camera-shutter.oga /usr/share/sounds/freedesktop/stereo/camera-shutter-disabled.oga
```

Also, if needed, compile a version of gnome-screenshot that doesn't flash the screen:

```
git clone https://github.com/GNOME/gnome-screenshot.git

cd gnome-screenshot
```

In src/screenshot-backend-shell.c replace all occurrences of TRUE, /* flash */ with FALSE, /* flash */ 

Install dependencies, probably something like 
```
sudo apt install meson 
ninja-build 
cmake
glib-2.0
pkg-config
libgtk2.0-dev
libgtk-3-dev 
build-essential libgtk-3-dev
libhandy-1-dev 
```

Build it:
```
meson setup build
meson test -C build
```

New gnome-screenshot exe is ./build/src/gnome-screenshot, so put it somewhere like:

```
cp ./build/src/gnome-screenshot /shared/gnome-screenshot-no-flash
```


## Assign a keyboard shortcut to toggle display configurations

For example, a keyboard shortcut to switch to external display only if currently using laptop display only, and vice-versa.

First, identify display IDs using `xrandr`:

```bash
xrandr
```

The output will be something like:

```
eDP-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 308mm x 173mm
...
...
DP-2-1 connected (normal left inverted right x axis y axis)
...
...
```

eDP-1 is usually the laptop's built-in screen, HDMI1, DP-2-1, etc. are external connection descriptors.  Note the names of the connected displays and ignore disconnected ones.

Create a bash script to do the toggling:

```bash
#!/bin/bash

# Set your display names
INTERNAL="eDP-1"
EXTERNAL="DP-2-1"

# Get current active display
ACTIVE_DISPLAY=$(xrandr --listmonitors | grep '+' | awk '{print $4}')

if [[ "$ACTIVE_DISPLAY" == "$INTERNAL" ]]; then
    # Switch to external only
    xrandr --output "$INTERNAL" --off --output "$EXTERNAL" --auto
elif [[ "$ACTIVE_DISPLAY" == "$EXTERNAL" ]]; then
    # Switch to internal only
    xrandr --output "$EXTERNAL" --off --output "$INTERNAL" --auto
else
    # Default fallback: switch to internal only
    xrandr --output "$EXTERNAL" --off --output "$INTERNAL" --auto
fi
```

Save the script somewhere like `~/toggle-display.sh`, then make it executable:

```bash
sudo chmod +x ~/toggle-display.sh
```

Test the script:

```bash
~/toggle-display.sh
```

Create the custom shortcut in System Settings -> Shortcuts.

