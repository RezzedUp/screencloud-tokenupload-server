'use strict';

let config = require('../config.json'),
    debug = config.debug;

function Suspect(ip)
{
    this.ip = ip;
    this.firstAccess = new Date();
    this.warnings = 1;
    this.isBanned = false;
}

function Auth(token)
{
    this.token = token;
    this.log = {};

    this.check = (ip, token) =>
    {
        if (debug)
        {
            console.log('Current watch log:');
            console.log(this.log);
        }

        if (this.isBanned(ip))
        {
            if (debug) { console.log('IP ' + ip + ' with token ' + token + ' is banned'); }

            return false;
        }
        else if (token != this.token)
        {
            if (debug) { console.log('IP ' + ip + ' tried authenticating with token ' + token); }

            this.watch(ip);
            return false;
        }
        else
        {
            if (debug) { console.log('IP ' + ip + ' successfully authenticated'); }

            return true;
        }
    }

    this.watch = (ip) =>
    {
        let suspect = this.log[ip];

        if (suspect === undefined)
        {
            suspect = new Suspect(ip);
            this.log[ip] = suspect;
        }
        else
        {
            suspect.warnings += 1;

            if (suspect.warnings > 4)
            {
                suspect.isBanned = true;
            }
        }
    }

    this.isBanned = (ip) =>
    {
        let suspect = this.log[ip];
        return (suspect === undefined) ? false : suspect.isBanned;
    }
}

module.exports = Auth;
