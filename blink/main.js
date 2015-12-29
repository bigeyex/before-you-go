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
var socketUltrasonic = require('./socketUltrasonic.js');
var weatherData = require('./weatherData.js');
var MeLCD = require('./MeLCD.js');

console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the Intel XDK console

var touchSensorGPIO = new mraa.Gpio(3);
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
socketUltrasonic.init();
weatherData.init();
wechatAudio.init();

function periodicActivity(){
  var touchSensorValue = touchSensorGPIO.read();
  if(touchSensorValue){
    console.log("touched..");
    
    var currentTimeStamp = new Date().getTime();
    if(currentTimeStamp - lastPlayMessageTimestamp > 10000 && !speaker.getIsPlaying()){
        MeLCD.clear();
        MeLCD.print(0,0,1,32,"You have 1 message");
        MeLCD.print(0,32,4,32,"Shen Zhen "+weatherData.lastResult);
        MeLCD.print(0,64,10,32,"PM 2.5: 65");
        MeLCD.print(0,128,2,32, wechatAudio.getLastWechatText());
        console.log('message: '+wechatAudio.getLastWechatText());
        
        wechatAudio.play(function(){
            console.log("ultra result: "+socketUltrasonic.lastResult);
            if(socketUltrasonic.getLastResult() == '1'){
                speaker.playWav('stuff.wav');
                console.log("has stuff...");
            }
            speaker.playWav('weather.wav');
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
