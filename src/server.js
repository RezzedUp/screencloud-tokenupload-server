'use strict';

let fs = require('fs'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    config = require('../config.json'),
    Auth = require('./auth'),
    Uploader = require('./upload');

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
const uploader = new Uploader(dir, config.url);

app.use
( 
    bodyParser.json({limit: config.image.size}) 
);

app.use(serveStatic(__dirname + '/../html'));
app.use(serveStatic(dir));

app.post('/', (req, res) =>
{
    let token = req.body.token,
        image = req.body.image,
        ipAddress = (config.listen.proxy) 
                  ? req.headers['x-forwarded-for'].toString()
                  : req.connection.remoteAddress;
    
    if (token == undefined || image == undefined) 
    {
        res.json({'error': 'Invalid input.'});
    }
    else if (!auth.check(ipAddress, token)) 
    {
        res.json({'error': 'Invalid token.'});
    }
    else 
    {
        res.json(uploader.upload(image));
    }
});

app.get('*', (req, res) => 
{
    res.status(404).json({'error': 'Page not found.'});
});

app.listen(config.listen.port, config.listen.address, () =>
{
    console.log('\n> ' + config.name + ' [' + config.listen.address + ':' + config.listen.port + ']\n');
});
