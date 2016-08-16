let fs = require('fs'),
    server = require('./src/server'),
    config = server.config;

let dir = __dirname + "/" + config.image.directory;

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
        console.log('Created images directory.');
    }
});