var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      //the detectObject function is like a opencv built-in loop that returns a faces array every few milliseconds 
      //find the node_modules/opencv/data folder and you can control its detection of eyes, mouth , nose etc...
      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
          face = faces[i];

          im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
          // someone online recommended changing the order of the rectangle format so i changed it to the above from this:
          // im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], rectColor, rectThickness);
        }

        socket.emit('frame', { buffer: im.toBuffer() });
      });
    });
  }, camInterval);
};