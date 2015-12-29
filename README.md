# before-you-go
a hackathon project in Intel Edison Roadshow (1st prize); a smart in-the-clould door handle.

## About the project
A house door is a seperation between inside and outside, between leisure and work, between comfy home and caring family and the strange world of uncertain. It holds various significance in everybody's mind.

Before-you-go is a device attached to your door handle; family members can save voice/text memos through APPs like Wechat (WhatsAPP equivalent in China), and "remind you something" before you leave, creating a conversation space among family memebers. This device can also remind you to take out your trash or carry a umbrella when it is raining (through reading online weather data).

This repo is the software part for this project. Written mostly in Javascript.

## A photo of the project
![Project Photo](https://raw.githubusercontent.com/bigeyex/before-you-go/master/product-photo.jpg)

## How to Run
You need an Intel edison development board and Intel XDK. The "blink" folder contains a XDK project.

## Description of files
- **blink/bleUltrasonic** tries to read ultrasonic sensor connected to another Arduino board via bluetooth. But it never succeeds...
- **blink/main.js** is the main file glues everything together;
- **blink/MeLED.js** drives a Makeblock LED modules with Intel Edison;
- **blink/socketUltrasonic.js** reads ultrasonic sensor data through a web service.
- **blink/speaker.js** use shell commands to playback audio clips(retrived from Wechat server) using a bluetooth speaker.
- **blink/weatherData.js** fetch weather data from a public server.
- **blink/wechatAudio.js** fetch wechat audio clips and play it through shell script.
- **onBoard/play.sh** shell script that converts and playback audio clips downloaded from Wechat server.

