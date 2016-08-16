'use strict';

let fs = require('fs'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    config = require('../config.json'),
    Auth = require('./auth');

const dir = __dirname + "/../" + config.image.directory;

fs.mkdir(dir, (err, stats) =>
{
    if (err)
    {
        if (err.code != 'EEXIST')
        {
            console.log(err);
        }
    }
    else
    {
        console.log('[+] Created images directory.');
    }
});

const auth = new Auth(config.auth);

app.use
( 
    bodyParser.json({limit: config.image.size}) 
);

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