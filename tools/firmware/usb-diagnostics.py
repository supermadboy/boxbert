#!/usr/bin/env python3
"""Bounded commissioning USB commands, without DTR/RTS reset or credential export.

Linux stdlib only. Commands are local physical-USB operations, not remote RPC.
A command is sent once even if CDC re-enumerates. Audio test commands force
volume 1 and have a firmware-side 20-second stop. Never use while uploading.
"""
import argparse
import datetime
import os
from pathlib import Path
import select
import sys
import termios
import time

DEFAULT_PORT = '/dev/serial/by-id/usb-Adafruit_Feather_ESP32-S3_Reverse_TFT_d0:cf:13:0b:fb:c8-if00'
COMMANDS = ('diag', 'test9', 'test10', 'test-stop', 'radio-off', 'radio-ble', 'radio-wifi', 'nfc-pause', 'nfc-resume')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', default=DEFAULT_PORT)
    parser.add_argument('--command', choices=COMMANDS)
    parser.add_argument('--seconds', type=float, default=10)
    parser.add_argument('--log', type=Path, required=True, help='Append capture; no credentials command is supported')
    args = parser.parse_args()
    if not 0 < args.seconds <= 120:
        parser.error('--seconds must be in (0,120]')
    args.log.parent.mkdir(parents=True, exist_ok=True)
    end = time.monotonic() + args.seconds
    sent = False
    with args.log.open('a', buffering=1) as log:
        log.write('\n# USB capture ' + datetime.datetime.now().isoformat() + '; no DTR/RTS ioctl\n')
        while time.monotonic() < end:
            fd = None
            try:
                fd = os.open(args.port, os.O_RDWR | os.O_NOCTTY | os.O_NONBLOCK)
                settings = termios.tcgetattr(fd)
                settings[0] = settings[1] = settings[3] = 0
                settings[2] = (settings[2] & ~(termios.PARENB | termios.CSTOPB | termios.CSIZE | termios.HUPCL)) | termios.CS8 | termios.CREAD | termios.CLOCAL
                settings[4] = settings[5] = termios.B115200
                settings[6][termios.VMIN] = settings[6][termios.VTIME] = 0
                termios.tcsetattr(fd, termios.TCSANOW, settings)
                if args.command and not sent:
                    command = (args.command + '\n').encode('ascii')
                    if os.write(fd, command) != len(command):
                        raise RuntimeError('Partial command write; not retrying')
                    sent = True
                    log.write('# Sent once: ' + args.command + '\n')
                while time.monotonic() < end:
                    if select.select([fd], [], [], min(.2, max(0, end - time.monotonic())))[0]:
                        data = os.read(fd, 8192)
                        if not data:
                            break
                        text = data.decode('utf-8', 'replace')
                        log.write(text)
                        print(text, end='', flush=True)
            except (OSError, termios.error):
                # Reconnect to stable by-id after a reset, but never replay a command.
                pass
            finally:
                if fd is not None:
                    os.close(fd)
            time.sleep(.05)
    if args.command and not sent:
        raise SystemExit('No USB connection: command was NOT sent')
    if args.command:
        print('\nCommand sent; inspect the device response, not merely this exit status.', file=sys.stderr)


if __name__ == '__main__':
    main()
