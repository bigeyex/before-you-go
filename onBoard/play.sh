#!/bin/sh
wget -q http://YOUR_WECHAT_SERVER/weaudio.amr -O /home/root/weaudio.amr
/home/root/bin/ffmpeg/ffmpeg -i /home/root/weaudio.amr -ar 22050 /home/root/weaudio.wav -y
gst-launch-1.0 filesrc location=/home/root/weaudio.wav ! decodebin ! pulsesink