'use strict';

let fs = require('fs'),
    crypto = require('crypto'),
    config = require('../config.json');

function Uploader(dir, url)
{
    if (typeof dir != 'string' || typeof url != string)
    {
        throw 'Invalid parameters: both should be strings.';
    }

    this.dir = dir;
    this.url = url;

    this.upload = (imgB64) =>
    {
        if (typeof imgB64 != string)
        {
            throw 'Invalid parameter: should be a string.';
        }

        let buf = new Buffer(imageB64, 'base64');
            name = this.getUniqueName(),
            dir = this.getDirectory(),
            path = dir + name,
            date = new Date()
            timestamp = '[' + date.getFullYear + '-';

        fs.writeFile(path, buf, 'binary', (err) =>
        {
            if (err) 
            {
                console.error('[' + timestamp + '] ' + '[!] Error while saving the image `' + name + '`', err);
            }
            else
            {
                console.log('[' + timestamp + '] ' + '[~] Saved file: ' + name);
            }
        });

    }

    this.getDirectory = () => (this.dir.endsWith('/')) ? this.dir : this.dir + '/';

    this.getUniqueName = () =>
    {
        let id = 
            crypto.createHash('sha256').update
            (
                "img:" + new Date().toString() + "(" + config.name + ")"
            )
            .digest('base64').replace(/\W+/g, "");

        let dir = this.getDirectory(),
            length = 10;

        for (let i = 0; i < id.length - length; i++)
        {
            let name = id.substring(i, length + i) + '.png',
                path = dir + name,
                stats = fs.statSync(path);

            try
            {
                if (stats.isFile())
                {
                    continue;
                }
            }
            catch (e)
            {
                return name;
            }
        }
    }

}

module.exports = Uploader;