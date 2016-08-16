"use strict";

var fs = require('fs');

var express = require('express');
var app = express();

var config = require('../config.json');
var Auth = require('./auth');

const auth = new Auth(config.auth);

var bodyParser = require('body-parser');

app.use
( 
    bodyParser.json({limit: config.image.size}) 
);

var serveStatic = require('serve-static');

app.use(serveStatic('../html'));
app.use(serveStatic('../' + config.image.directory));

app.post('/', function(req, res)
{
    let token = req.body.token,
        image = req.body.image,
        ipAddress = (config.listen.proxy) 
                  ? req.headers['x-forwarded-for'].toString()
                  : req.connection.remoteAddress;
    
    if (token == undefined || image == undefined) 
    {
        res.json({"error": "Invalid input."});
    }
    else if (!auth.check(ipAddress, token)) 
    {
        res.json({"error": "Bad auth token."});
    }
    else 
    {
        // TODO: upload file
    }
});

app.listen(config.listen.port, config.listen.address, 
    function () 
    {
        console.log('\n> screencloud-tokenupload-server [' + config.listen.address + ':' + config.listen.port + ']\n');
    }
);

module.exports = 
{
    config: config
};