var g;

var img = {
  width : 32, height : 30, bpp : 1,
  transparent : 0,
  buffer : E.toArrayBuffer(atob("Qk2gAAAAAAAAACAAAAAMAAAAIAAgAAEAAQD///8AAAAAAAAAAAAAAAAPAAAAAIKgAAbLIAAMNMAACFKgABCEEAAwCFAA9SEQADBbkABkBmABlKkQAWIEEABACSAAoVAgBSEEIBoSAaBgpnEgCAAgoFFGpiAAA48AIAEGwAIBACAUBUoAAAQQkAAEgKwABAAIAA8ALgAOAB0ACAAGAAAAAA=="))
};

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
}

function onInit(){
  lcdInit();
  uartInit();
}


onInit();

var cmd = '';

Serial1.on('data', function (data) { 
  console.log('Hey', JSON.stringify(data));
  cmd += data;
  var idx = cmd.indexOf("\r");
  if (idx > -1) {
    g.clear();
    g.drawString("Received: " + cmd,0,0);
    g.flip();
  }
});


pinMode(B4, "input_pulldown");

setWatch(function(e) {
  if (!g) return; // graphics not initialised yet
  g.clear();
  g.drawString('Button pressed',0,0);
  // send the graphics to the display
  g.flip();
  Serial1.print('Hello');
  g.drawString('Hello sent',0,15);
  g.flip();
}, B4, { repeat: true, debounce : 50, edge: "rising" });