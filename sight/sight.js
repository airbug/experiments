var cv = require('opencv');
var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var streamifier = require('streamifier');

app.listen(8000);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

io.on('connection', function (socket) {
    //TEST
    console.log("Connection received");

    socket.on("snapshot", function(data) {
        var base64Image = data.image.replace("data:image/jpeg;base64,", "");
        var buffer = new Buffer(base64Image, "base64");

        var s = new cv.ImageDataStream();
        s.on('load', function(matrix) {
            if (matrix) {
                matrix.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
                    for (var i = 0; i < faces.length; i++) {
                        var face = faces[i];
                        matrix.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
                    }
                    var base64 = matrix.toBuffer().toString("base64");
                    socket.broadcast.emit('show', { image: base64 });
                });
            }
        });

        var readStream = streamifier.createReadStream(buffer);
        readStream.pipe(s)
    });
});
