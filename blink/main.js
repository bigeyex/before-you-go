/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
A simple node.js application intended to blink the onboard LED on the Intel based development boards such as the Intel(R) Galileo and Edison with Arduino breakout board.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
*/

var mraa = require('mraa'); //require mraa
var speaker = require('./speaker.js');
var wechatAudio = require('./wechatAudio.js');
//var bleUltrasonic = require('./bleUltrasonic.js');
//var socketUltrasonic = require('./socketUltrasonic.js');
var weatherData = require('./weatherData.js');
var MeLCD = require('./MeLCD.js');
var tts = require('./tts.js');

console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the Intel XDK console

var touchSensorGPIO = new mraa.Gpio(15);
var lastPlayMessageTimestamp = 0;
touchSensorGPIO.dir(mraa.DIR_IN);

periodicActivity(); //call the periodicActivity function


console.log("init...");

//wechatAudio.play(function(){
//    speaker.playWav('weaudio.wav');
//    speaker.playWav('weaudio.wav');
//
//});
//bleUltrasonic.init();
//socketUltrasonic.init();
weatherData.initWithInterval(10000);
wechatAudio.init();

function periodicActivity(){
  var touchSensorValue = touchSensorGPIO.read();
  if(touchSensorValue){
    console.log("touched..");
    
    var currentTimeStamp = new Date().getTime();
    if(currentTimeStamp - lastPlayMessageTimestamp > 10000 && !speaker.getIsPlaying()){
        MeLCD.clear();
        MeLCD.print(0,0,1,32,"You have 1 message");
        MeLCD.print(0,32,4,32,"Shen Zhen " + weatherData.realtimeTemp() + " C");
         MeLCD.print(0,64,4,32, weatherData.realtimeWeather());
        MeLCD.print(0,96,10,32,"PM 2.5: " + weatherData.realtimePM25());
        console.log(weatherData.realtimePM25());
        console.log(weatherData.realtimeWeather());
        MeLCD.print(0,160,2,32, wechatAudio.getLastWechatText());
        console.log('message: '+wechatAudio.getLastWechatText());
        
        wechatAudio.play(function(){
            var textToSpeak = "今日气温"+weatherData.realtimeTemp()+"度，空气质量"+weatherData.realtimeAirQuality();
            if(wechatAudio.getLastWechatText()){
                textToSpeak += "。您有文字留言："+wechatAudio.getLastWechatText();
            }
            tts.speak(textToSpeak);
        });
        lastPlayMessageTimestamp = currentTimeStamp;
    }
  } // if touchSensorValue
  else{
//      MeLCD.clear();
//      setTimeout(function(){
//          
//      }, 10000);
        
  }
    
  setTimeout(periodicActivity,200); //call the indicated function after 1 second (1000 milliseconds)
}
