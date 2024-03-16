#! /bin/bash

echo removing http service...

sudo systemctl disable pi-clock-http.service
sudo rm -f /lib/systemd/system/pi-clock-http.service


echo disabling full-screen browser autostart...

rm -f /home/pi/.config/autostart/pi-clock.desktop 

echo Please Reboot now.  http server and screensaver should no longer run automatically when system boots
