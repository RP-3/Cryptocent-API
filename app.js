/*load app basics and create app*/
var express = require('express');
var app = express();
var config = require('./config/config.js');

config(app);

app.listen(process.env.PORT || 3000);