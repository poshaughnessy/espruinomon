var g;

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
    g.drawString('Hello World!',0,0);
    // send the graphics to the display
    g.flip();
  });
  console.log('lcd init');
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
  g.clear();
  g.drawString("Recieved: " + data,0,0);
  g.flip();
});


function button1(e){
  console.log('button 1');
  send();
}

setWatch( button1, B3, { repeat: true, debounce : 50, edge: "rising" });

function button2(e) {
  console.log('button 2');
}

setWatch(button2, B4, { repeat: true, debounce : 50, edge: "rising" });


function send() {
  if (!g) return; // graphics not initialised yet
  g.clear();
  g.drawString('Button pressed',0,0);
  // send the graphics to the display
  g.flip();
  Serial1.println('Hello');
  g.drawString('Hello sent',0,15);
  g.flip();
}