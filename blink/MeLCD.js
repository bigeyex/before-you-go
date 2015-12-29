var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion());
u = new m.Uart(0)

console.log("Note: connect Rx and Tx of UART with a wire before use");

function sleep(delay) {
  delay += new Date().getTime();
  while (new Date() < delay) { }
}

console.log("Set UART parameters");

u.setBaudRate(9600);
u.setMode(8, 0, 1);
u.setFlowcontrol(false, false);
sleep(200);

console.log("First write-read circle:");

//u.writeStr("test\n");
//lcd_print_str(64,104,4,64,"just for test!");
//sleep(500);
//console.log(u.readStr(100));
//sleep(200);

function lcd_print_str(pos_x,pos_y,color,type,str)
{
  u.writeStr("DR0;DS"+type+"("+pos_x+","+pos_y+",'"+str+"',"+color+");\r\n");
}

function lcd_clear_all()
{
  u.writeStr("CLS(0);CLS(0);DR0;\r\n");
}

module.exports = {
    clear: lcd_clear_all,
    print: lcd_print_str
};
