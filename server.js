/* eslint-disable */

var path = require("path");
var express = require("express");
var webpack = require("webpack");
var config = require("./webpack.config");

var app = express();
var compiler = webpack(config);

var serverPort = process.env.PORT || 3000;
let host = `localhost`;

//only for codespaces
if(process.env.CODESPACE_NAME){
  host = `0.0.0.0`;
}

app.use(require("webpack-dev-middleware")(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(serverPort, process.env.IP || host, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Listening at http://"+host+":" + serverPort);
});