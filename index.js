var g;


var img = require("BMPLoader").load(atob("Qk3AAAAAAAAAAD4AAAAoAAAAIAAAACAAAAABAAEAAAAAAIIAAAASCwAAEgsAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAPAAAAAIKgAAbLIAAMNMAACFKgABCEEAAwCFAA9SEQADBbkABkBmABlKkQAWIEEABACSAAoVAgBSEEIBoSAaBgpnEgCAAgoFFGpiAAA48AIAEGwAIBACAUBUoAAAQQkAAEgKwABAAIAA8ALgAOAB0ACAAGAAAAAAAA"));

var STATUS = {
  DEFAULT: 'DEFAULT',
  DEFENDING: 'DEFENDING'
};

var playerMe = {
  health: 100,
  status: STATUS.DEFAULT
};


function lcdInit(){
  A5.write(0); // GND
  A7.write(1); // VCC
  A6.write(0); // Turn on the backlight
  
  var spi = new SPI();
  spi.setup({ sck:B1, mosi:B10 });
  // Initialise the LCD
  g = require("PCD8544").connect(spi,B13,B14,B15, function() {
    redraw();
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

Serial1.on('data', function (data) { 
  console.log('data', JSON.stringify(data));
  if (data === 'A') {
    console.log('Been attacked!');
    playerMe.health = playerMe.health - 10;
    playerMe.status = STATUS.DEFAULT;
    redraw();
  }  
});

function drawCharacter() {
  console.log('Draw character');
  g.drawImage(img, 10, 5);  
}

function drawHealthMeter() {
  var string = '';
  for (var i=0; i <= playerMe.health / 10; i++) {
    console.log('string', string);
    string += '*';
  }
  console.log('Draw health');
  g.drawString(string,10,40);
}

function redraw() {
  g.clear();
  drawCharacter();
  drawHealthMeter();
  g.flip();
}

// Defend
function button1(e){
  console.log('Defend button pressed');
  playerMe.status = STATUS.DEFENDING;
}

setWatch( button1, B3, { repeat: true, debounce : 50, edge: "rising" });

// Attack
function button2(e) {
  console.log('Attack button pressed');
  playerMe.status = STATUS.DEFAULT;
  send('A');
  redraw();
}

setWatch(button2, B4, { repeat: true, debounce : 50, edge: "rising" });

function send(data) {
  Serial1.println(data);
  console.log('Sent: ', data);
}
