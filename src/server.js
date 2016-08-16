"use strict";

var fs = require('fs');

var express = require('express');
var app = express();

var config = require('../config.json');

const AUTH_TOKEN = config.auth;

(function ()
    {
        let dir = '../' + config.image.directory;
        let stats = fs.stat(dir);

        if (!stats.isDirectory())
        {
            fs.mkdirSync(dir);
        }
    }
)();

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
        ipAddress;

    if (config.listen.proxy)
    {
	    ipAddress = req.headers['x-forwarded-for'].toString();
    }
    else
    {
        ipAddress = req.connection.remoteAddress;
    }
    
    // TODO: banned IPs

    if (token == undefined || image == undefined) 
    {
		res.json({"error": "Invalid input."});
	}
    else if (token != AUTH_TOKEN) 
    {
		res.json({"error": "Bad auth token."});
	}
    else 
    {
        // TODO: upload file
    }
});

module.exports = 
{
    config: config
};