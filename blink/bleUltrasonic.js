var noble = require('noble');

//var ultrasonicBleID = "001b100e1260";
var ultrasonicBleID = "0001020306b4";

var lastResult = 0;

var writeCharacteristic = null;

var BLEinit = function(){
    noble.on('stateChange', function(state) {
      if (state === 'poweredOn') {
        noble.startScanning();
      } else {
        noble.stopScanning();
      }
    });

    noble.on('discover', function(peripheral) {
        if(peripheral.id == ultrasonicBleID){
            peripheral.connect(function(){
                // todo if connected
                console.log("connected to ultrasonic");
                peripheral.discoverServices(['ffe1'], function(error, services) {
                  var deviceInformationService = services[0];
                  console.log('discovered service');
//                  console.log(services);

                  deviceInformationService.discoverCharacteristics(['ffe3'], function(error, characteristics) {
                    console.log("discovered characteristic");
//                      console.log(characteristics);
                      writeCharacteristic = characteristics[0];
//                      doUltrasoinic();
                      setInterval(function(){
                          ultrasoinic(0, 1);
                      }, 1000);
//                      writeCharacteristic.on('data', function(data, isNotification){
//                          console.log(data);
//                      });
                      writeCharacteristic.on('read', function(data, isNotification) {
                          console.log('battery level is now: ', data.readUInt8(0) + '%');
                        });
                  });
                    
                  deviceInformationService.discoverCharacteristics(['ffe2'], function(error, characteristics) {
                    console.log("discovered reader");
//                      console.log(characteristics);
                      var readCharacteristic = characteristics[0];
//                      writeCharacteristic.on('data', function(data, isNotification){
//                          console.log(data);
//                      });
//                      readCharacteristic.on('read', function(data, isNotification) {
//                          console.log(data);
//                          console.log('battery level is now: ', data.readUInt8(0) + '%');
//                        });
                      readCharacteristic.notify(true, function(error) {
                          console.log('notify on'+error);
                        });
                  });
                });

            });
        }
//        console.log('Found device with id: '+peripheral.id+' local name: ');
//        console.log(JSON.stringify(peripheral.advertisement));
//        console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
//        console.log();
    });
};


/**
 * hardware control
 */

var buffer = [],
    flag4Left,
    flag4Right,
    globalSocketIO = null,
    timeInterval = 0;

var SETTING = {
    //自定义协议
    CODE_COMMON: [0xff, 0x55, 0],

    //设备类型
    DEV_VERSION: 0,
    DEV_ULTRASOINIC: 1,  //超声波
    DEV_TEMPERATURE: 2,
    DEV_LIGHTSENSOR: 3,
    DEV_POTENTIALMETER: 4,
    DEV_GYRO: 6,
    DEV_SOUNDSENSOR: 7,
    DEV_RGBLED: 8,
    DEV_SEVSEG: 9,
    DEV_DCMOTOR: 10,
    DEV_SERVO: 11,
    DEV_ENCODER: 12,
    DEV_JOYSTICK: 13,
    DEV_PIRMOTION: 15,
    DEV_INFRADRED: 16,
    DEV_LINEFOLLOWER: 17,  // 巡线
    DEV_BUTTON: 18,
    DEV_LIMITSWITCH: 19,
    DEV_PINDIGITAL: 30,
    DEV_PINANALOG: 31,
    DEV_PINPWM: 32,
    DEV_PINANGLE: 33,
    TONE: 34,

    SLOT_1: 1, //0
    SLOT_2: 2, //1

    READMODULE: 1,
    WRITEMODULE: 2,

    VERSION_INDEX: 0xFA,

    //端口：1，2，3，4对应四个大的端口
    //5，6，7，8需要看下位机的固件代码
    //M1，M2白色的端口，上面有文字
    PORT_NULL: 0,
    PORT_1: 1,
    PORT_2: 2,
    PORT_3: 3,
    PORT_4: 4,
    PORT_5: 5,
    PORT_6: 6,
    PORT_7: 7,
    PORT_8: 8,
    PORT_M1: 9,
    PORT_M2: 10,

    //说明书上:超声波4，巡线2
    PORT_ULTRASOINIC:  6,  //超声波port
    PORT_LINEFOLLOWER: 2,  //巡线port

    //巡线：需要手机端控制
    MSG_VALUECHANGED: 0x10,

    tap_duration: 0.4,

    SPEED_START: 100,    //初始速度
    SPEED_MAX:   255,    //最大速度
    SPEED_CHANGE_TURN_PER: 30,  //转弯时候，每次速度变化
    SPEED_CHANGE_PER: 30,  //加速减速时候，每次速度变化

    //小车的工作模式
    MODE_NONE:      0,
    MODE_AUTO:      1,
    MODE_MANUAL:    2,
    MODE_CRUISE:    3,
    MODE_GYRO:      4,
    MODE_SPEED_MAX: 5,


    //RGB
    RGB_BRIGHTNESS: 20,
    LedPosition : {
        LEFT: 1,
        RIGHT: 2,
        BOTH: 0
    },

    // tone
    TONE_HZ: [262,294,330,349,392,440,494],
    ToneHzTable : {
        "C2":65, "D2":73, "E2":82, "F2":87, "G2":98, "A2":110, "B2":123, "C3":131, "D3":147, "E3":165, "F3":175, "G3":196, "A3":220, "B3":247, "C4":262, "D4":294, "E4":330, "F4":349, "G4":392, "A4":440, "B4":494, "C5":523, "D5":587, "E5":658, "F5":698, "G5":784, "A5":880, "B5":988, "C6":1047, "D6":1175, "E6":1319, "F6":1397, "G6":1568, "A6":1760, "B6":1976, "C7":2093, "D7":2349, "E7":2637, "F7":2794, "G7":3136, "A7":3520, "B7":3951, "C8":4186
    },

    ulTimer: 0,
    timeCount1: 0,
    timeCount: 0,
    lineTimer: 0
}

// 获取压力传感器
function getPressure() {

}

// 超声波控制
function doUltrasoinic() {
    SETTING.ulTimer = setInterval(function() {
        SETTING.timeCount1++;
        if(SETTING.timeCount1 > 1000) {
            clearInterval(SETTING.ulTimer);
            SETTING.timeCount1 = 0;
            return false;
        }
        ultrasoinic(0, 1);
    }, 500);
};

function stopUltrasoinic() {
    clearInterval(SETTING.ulTimer);
};

function ultrasoinic(slot, index) {
    var type = SETTING.DEV_ULTRASOINIC;
    var port = SETTING.PORT_ULTRASOINIC;
    buildModuleRead(type, port, slot, index);
}


//蜂鸣器
var i = 0;
function buzzer(toneName) {
    // 演奏调
    if(toneName) {
        if(toneName in SETTING.ToneHzTable){
            playBuzzer(SETTING.ToneHzTable[toneName]);
        }
    } else {
        // 发出下一个HZ
        if(i > SETTING.TONE_HZ.length - 1) {
            i = 0;
        }
        var hz = SETTING.TONE_HZ[i];
        i++;
        playBuzzer(hz);
    }
};

function playBuzzer(hz){
    buildModuleWriteBuzzer(hz);

    setTimeout(function() {
        stopBuzzer();
    }, 300);
}

// 停止蜂鸣器
function stopBuzzer() {
    buildModuleWriteBuzzer(0);
};

// 停止灯
function stopLed() {
    setLed(0,0,0);
};




// 解析小车返回的数据
decodeData = function(data) {
    var bytes = data;

    for(var i = 0; i < bytes.length; i++) {
        buffer.push(bytes[i]);
        if(bytes[i] == 10) {
            if(buffer.length != 10) {
                buffer = [];
            } else {
                if((buffer[4] + buffer[5]) == 0) {
                    // 巡线
                   // lineFollow_callback();
                } else {
                    // 超声波
                    ultrasoinic_callback();
                }
            }
        }
    }
};

//------- 超声波回调执行 ---------
ultrasoinic_callback = function() {
    mylog('-------------ultrasoinic data start-------------');

    if(buffer[0] == 0xff && buffer[1] == 0x55) {
        // mylog(buffer[7] + '-' + buffer[6] + '-' + buffer[5] + '-' + buffer[4]);
        var distance = getResponseValue(parseInt(buffer[7]), parseInt(buffer[6]), parseInt(buffer[5]), parseInt(buffer[4]));
        mylog(distance);

        // 向客户端发送数据, 3秒以内算一次通过
        globalSocketIO.emit('pushToWebClient', {
            "type": 'ultrasoinic',
            "distance": distance
        });
    } else {
        mylog('end');
    }
};

/**
 * 数据转化
 */
buildModuleRead = function(type, port, slot, index) {
    var a = new Array(9);
    a[0] = SETTING.CODE_COMMON[0];
    a[1] = SETTING.CODE_COMMON[1];
    a[2] = 0x5;
    a[3] = index;
    a[4] = SETTING.READMODULE;
    a[5] = type;
    a[6] = port;
    a[7] = slot;
    a[8] = SETTING.CODE_COMMON[2];
    sendRequest(a);
};

buildModuleWriteShort = function(type, port, slot, value) {
    var a = new Array(10);
    a[0] = SETTING.CODE_COMMON[0];
    a[1] = SETTING.CODE_COMMON[1];
    a[2] = 0x6;
    a[3] = 0;
    a[4] = SETTING.WRITEMODULE;
    a[5] = type;
    a[6] = port;
    a[7] = value&0xff;
    a[8] = (value>>8)&0xff;
    a[9] = SETTING.CODE_COMMON[2];
    sendRequest(a);
};

/**
 * build RGB machine code.
 * @private
 */
buildModuleWriteRGB = function(type, port, slot, index, r, g, b) {
    var a = new Array(12);
    a[0] = SETTING.CODE_COMMON[0];
    a[1] = SETTING.CODE_COMMON[1];
    a[2] = 0x8;
    a[3] = 0;
    a[4] = SETTING.WRITEMODULE;
    a[5] = type;
    a[6] = port;
    a[7] = index;
    a[8] = r;
    a[9] = g;
    a[10] = b;
    a[11] = SETTING.CODE_COMMON[2];
    sendRequest(a);
};

/**
 * build Buzzer machine code
 * @private
 */
buildModuleWriteBuzzer = function(hz) {
    var a = new Array(10);
    a[0] = SETTING.CODE_COMMON[0];
    a[1] = SETTING.CODE_COMMON[1];
    a[2] = 0x5;  //后面的数据长度
    a[3] = 0;
    a[4] = SETTING.WRITEMODULE;
    a[5] = SETTING.TONE;
    a[6] = hz&0xff;
    a[7] = (hz>>8)&0xff;

    a[8] = 0;
    a[9] = SETTING.CODE_COMMON[2];
    sendRequest(a);
};


// 发送字节流到串口
function sendRequest(bufferData) {
    console.log("send read requrest");
    console.log(bufferData);
    writeCharacteristic.write(new Buffer(bufferData), true, function(error){
        console.log("written "+error);
    });
}


/* 解析从小车返回的字节数据 */
getResponseValue = function(b1, b2, b3, b4) {
    var intValue = fourBytesToInt(b1,b2,b3,b4);
    var result = parseFloat(intBitsToFloat(intValue).toFixed(2));

    return result;
};

fourBytesToInt = function(b1,b2,b3,b4 ) {
    return ( b1 << 24 ) + ( b2 << 16 ) + ( b3 << 8 ) + b4;
};


intBitsToFloat = function(num) {
    /* s 为符号（sign）；e 为指数（exponent）；m 为有效位数（mantissa）*/
    s = ( num >> 31 ) == 0 ? 1 : -1,
    e = ( num >> 23 ) & 0xff,
    m = ( e == 0 ) ?
    ( num & 0x7fffff ) << 1 :
    ( num & 0x7fffff ) | 0x800000;
    return s * m * Math.pow( 2, e - 150 );
};

/* 自定义日志输出 */
function mylog(msg) {
    console.log(msg);
}

module.exports = {
    init: BLEinit,
    lastResult: lastResult
}
