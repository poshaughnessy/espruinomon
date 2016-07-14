var g;


var img = require("BMPLoader").load(atob("Qk3AAAAAAAAAAD4AAAAoAAAAIAAAACAAAAABAAEAAAAAAIIAAAASCwAAEgsAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAPAAAAAIKgAAbLIAAMNMAACFKgABCEEAAwCFAA9SEQADBbkABkBmABlKkQAWIEEABACSAAoVAgBSEEIBoSAaBgpnEgCAAgoFFGpiAAA48AIAEGwAIBACAUBUoAAAQQkAAEgKwABAAIAA8ALgAOAB0ACAAGAAAAAAAA"));

function lcdInit(){
  A5.write(0); // GND
  A7.write(1); // VCC
  A6.write(0); // Turn on the backlight
  
  var spi = new SPI();
  spi.setup({ sck:B1, mosi:B10 });
  // Initialise the LCD
  g = require("PCD8544").connect(spi,B13,B14,B15, function() {
    // When it's initialised, clear it and write some text

    g.clear();
    //g.drawString('Hello World!',0,0);
    
    g.drawImage(img, 10, 10);
    
    // send the graphics to the display
    g.flip();
    
  });
}

function uartInit(){
  USB.setConsole();
  Serial1.setup(9600/*baud*/);
  console.log('uart init');
}

function initButtons(){
  pinMode(B4, "input_pulldown");
  pinMode(B3, "input_pulldown");
  console.log('buttons init');
}

function onInit(){
  lcdInit();
  uartInit();
  initButtons();
}


onInit();

var cmd = '';

Serial1.on('data', function (data) { 
  console.log('data', JSON.stringify(data));
  cmd += data;
  var idx = cmd.indexOf("\r");
  if (idx > -1) {
    console.log('recieved:', cmd);
    processData(cmd);
    cmd='';
  }
});


var playerMe = {
  health: 100
};

function drawHealthMeter() {
  var string = '';
  for (var i=0; i < playerMe.health / 10; i++) {
    console.log('string', string);
    string += '*';
  }
  console.log('DRAW HEALTH METER');
  g.clear();
  g.drawString(string,0,10);
  g.flip();
}


function button1(e){
  console.log('button 1 pressed');
  send('Hello');
  drawHealthMeter();
}

setWatch( button1, B3, { repeat: true, debounce : 50, edge: "rising" });

function button2(e) {
  console.log('button 2 pressed');
}

setWatch(button2, B4, { repeat: true, debounce : 50, edge: "rising" });

function send(data) {
  Serial1.println(data);
  console.log('Sent: ', data);
}

function processData(data){
  console.log('processed:',data);
}
