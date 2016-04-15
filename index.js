/**
 * Created by Tommy on 4/15/16.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();
app.all('/*', function (req, res) {
  var reqPath = req.originalUrl;
  var filePath = findFileByPath(reqPath);
  var result;
  console.log('============================================');
  console.log('Request to:  ' + reqPath);
  console.log('Request content:  ' + req.body);
  if (filePath) {
    fs.readFile(filePath, 'utf-8', function (error, data) {
      if (error) throw error;
      console.log('Response file found at ' + filePath);
      try {
        result = JSON.parse(data);
      } catch (e) {
        res.send('Errors found when parsing JSON, check your JSON file at ' + filePath);
        console.log('Errors found when parsing JSON, check your JSON file at ' + filePath);
        console.log('============================================');
        return;
      }
      console.log('Response content ' + result.toString());
      res.json(result);
      console.log('============================================');
    });
  } else {
    res.send('Cound\'t find corresponding file at ' + reqPath);
    console.log('Cound\'t find corresponding file at' + reqPath);
    console.log('============================================');
  }
});


function findFileByPath(filePath) {
  try {
    if (fs.statSync(path.join('responses', filePath)).isFile()) {
      return path.join('responses', filePath);
    }
  } catch (e) {}
  try {
    if (fs.statSync(path.join('responses', filePath + '.json')).isFile()) {
      return path.join('responses', filePath + '.json');
    }
  } catch (e) {}
  try {
    if (fs.statSync(path.join('responses', filePath, 'index.json')).isFile()) {
      return path.join('responses', filePath, 'index.json');
    }
  } catch (e) {}
  return null;
}

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('JSON Server listening at port ' + port);
});
