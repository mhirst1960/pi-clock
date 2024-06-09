#! /bin/bash

echo removing http service...

sudo systemctl disable pi-clock-http.service
sudo rm -f /lib/systemd/system/pi-clock-http.service


echo disabling full-screen browser autostart...

rm -f $HOME/.config/autostart/pi-clock.desktop 

if [[ -e $HOME/.config/wayfire.ini ]]; then
    grep -v 'pi-clock/index.html' $HOME/.config/wayfire.ini > $HOME/.config/wayfire.tmp
    mv $HOME/.config/wayfire.tmp $HOME/.config/wayfire.ini
fi

echo Please Reboot now.  http server and screensaver should no longer run automatically when system boots
