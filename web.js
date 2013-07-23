var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  var buf = fs.readFileSync("./index.html");
  //response.send('Hello World2!');
  response.send(buf.toString('utf-8'));
});

/*
app.get("/images/:imgName(.*).jpg", function(request, response) {
  var imageName = request.params['imgName'];
  console.log('image name=' + imageName);
  var validImgs = [ 'drone_diag2.jpg', 'taser_xrep2.jpg', 'bean_bag_bullets.jpg' ];
  if ( validImgs.indexOf(imageName) >= 0 ) {
    var action = request.pathname;
    var img = fs.readFileSync('./images/' + imageName);
    response.writeHead(200, {'Content-Type': 'image/jpg' });
    response.end(img, 'binary');
  }
});
*/

//var port = process.env.PORT || 5000;
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
