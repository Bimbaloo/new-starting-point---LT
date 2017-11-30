const express = require('express');
const http = require('http')
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

function fn (options) {
    return function(req, res, next) {
        console.log("req.body")        
        console.log(req.body)
        next()
    }
    res.send(req.body);
}

app.use(fn())

app.use('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});