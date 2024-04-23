# This python script opens a gate to release a pie.abs
# The pie slides down a chute and comes to rest in the
# pie plate next to the clock.abs
# 
# The assumption is that this script will be called once a day a 3:14 aka pi-time!
# 
# Technically at this does is set GPIO 4 to high for 1 second.
# The assumption is that GPIO 4 is connected to a relay that
# pulls a solenoid that opens that gate at the top of the pie-slide.

import gpiod
import time

RELAY_PIN = 4

# on Raspberry pi 5 you need to specify the section of the chip that
# the GPIO is controlled by.  Using the line connected to GPIO 4
# specify it as output.

chip = gpiod.Chip('gpiochip4')
relay = chip.get_line(RELAY_PIN)
relay.request(consumer="RELAY", type=gpiod.LINE_REQ_DIR_OUT)

# set GPIO 4 high (gate open) for one second
# then set it back to low (gate closed) and exit.

try:
    relay.set_value(1)
    time.sleep(1)
    relay.set_value(0)
finally:
   relay.release()

