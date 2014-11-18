var phantom = require('phantom');

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

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
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.viewportSize = {
                width: 1920,
                height: 1080
            };
            
            page.open("https://www.facebook.com", function (status) {
                console.log("opened google? ", status);
                if (status) {
                    page.renderBase64('PNG', function(base64) {
                        console.log(base64);
                        socket.emit('image', { image: base64 });
                        ph.exit();
                    });
                }
            });
        });
    });
});



