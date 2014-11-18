var cv = require('opencv');
var fs = require('fs');
var streamifier = require('streamifier');

fs.readFile('brian-linkedin.jpg', function(err, data) {

    var base64Image = data.toString('base64');
    var buffer = new Buffer(base64Image, "base64");

    var s = new cv.ImageDataStream();
    s.on('load', function(matrix) {
        if (matrix) {
            console.log(matrix);
            console.log(matrix.getRows());
        }
    });

    var readStream = streamifier.createReadStream(buffer);

    readStream.pipe(s)
});

