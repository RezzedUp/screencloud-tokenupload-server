'use strict';

let config = require('../config.json'),
    debug = config.debug;

function isString(str)
{
    return (typeof str == 'string');
}

function Suspect(ip)
{
    if (!isString(ip))
    {
        throw 'Attempted to create a new Suspect with invalid ip.';
    }
    this.ip = ip;
    this.warnings = 1;
}

function Auth(token)
{
    this.token = token;
    this.watching = [];
    this.banned = [];

    this.check = (ip, token) =>
    {
        if (!isString(ip) || !isString(token) || this.isBanned(ip))
        {
            if (debug) console.log('IP ' + ip + ' with token ' + token + ' is banned');

            return false;
        }
        else if (token != this.token)
        {
            if (debug) console.log('IP ' + ip + ' tried authenticating with token ' + token);

            this.watch(ip);
            return false;
        }
        else
        {
            if (debug) console.log('IP ' + ip + ' successfully authenticated');

            return true;
        }
    }

    this.watch = (ip) =>
    {
        let index = this.indexOfWatchedIp(ip),
            suspect;

        if (index > -1)
        {
            suspect = this.watching[index];
            suspect.warnings += 1;

            if (suspect.warnings > 4)
            {
                this.banned.push(suspect.ip);
                this.watching.splice(index, 1);
            }
        }
        else
        {
            suspect = new Suspect(ip);
            this.watching.push(suspect);
        }
    }

    this.indexOfWatchedIp = (ip) =>
    {
        for (let index in this.watching)
        {
            if (this.watching[index].ip == ip)
            {
                return index;
            }
            return -1;
        }
    }

    this.isBanned = (ip) =>
    {
        return this.banned.includes(ip);
    }
}

module.exports = Auth;