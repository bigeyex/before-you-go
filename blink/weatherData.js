var request = require('request');


var socket = null;

var realtimeWeather = "Clouds";
var realtimePM25 = 18;
var realtimeAirQuality = "优";
var realtimeTemp = 25;

var getRealtimeWeather = function(){ return realtimeWeather; }
var getRealtimePM25 = function(){ return realtimePM25; }
var getRealtimeAirQuality = function(){ return realtimeAirQuality; }
var getRealtimeTemp = function(){ return realtimeTemp; }

var timer = null;

var update = function(){
    console.log("upldating weather data");
    request('http://www.pm25.in/api/querys/pm2_5.json?token=pMHDRFqWye7N3zqt5zX6&city=shenzhen&avg=true&stations=true', function(error, response, body) {
      if(body){
          try{
              var airQualitySource = JSON.parse(body);
              if(airQualitySource && airQualitySource.length && airQualitySource.length>1){
                  realtimePM25 = airQualitySource[airQualitySource.length-1].pm2_5;
                  realtimeAirQuality = airQualitySource[airQualitySource.length-1].quality;
              }
              console.log("PM2.5:"+realtimePM25+" quality:"+realtimeAirQuality);
          }
          catch(e){
              
          }
      }
      
    });
    request('http://api.openweathermap.org/data/2.5/weather?q=shenzhen&APPID=83ad4e033b7f5ecd71a75cb064abc2fb', function(error, response, body) {
      if(body){
          try{
              var weatherSource = JSON.parse(body);
              if(weatherSource){
                  realtimeTemp = Math.round(weatherSource.main.temp - 273.15);
                  realtimeWeather = weatherSource.weather[0].description;
              }
               console.log("temp:"+realtimeTemp+" weather:"+realtimeWeather);
          }
          catch(e){
              
          }
      }
      
    });
}

var init = function(interval){
   update();
}

module.exports = {
    initWithInterval: init,
    realtimeWeather: getRealtimeWeather,
    realtimePM25: getRealtimePM25,
    realtimeTemp: getRealtimeTemp,
    realtimeAirQuality: getRealtimeAirQuality
}
