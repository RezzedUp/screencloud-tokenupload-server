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

    this.check = function(ip, token)
    {
        if (!isString(ip) || !isString(token) || isBanned(ip))
        {
            return false;
        }
        else if (token != this.token)
        {
            watch(ip);
            return false;
        }
        else
        {
            return true;
        }
    }

    this.watch = function(ip)
    {
        let index = this.indexOfWatchedIp(ip),
            suspect;

        if (index > -1)
        {
            suspect = watching[index];
            suspect.warnings += 1;

            if (suspect.warnings > 4)
            {
                banned.push(suspect.ip);
            }
        }
        else
        {
            suspect = new Suspect(ip);
        }
    }

    this.indexOfWatchedIp = function(ip)
    {
        for (let index in watching)
        {
            if (watching[index].ip == ip)
            {
                return index;
            }
            return -1;
        }
    }

    this.isBanned = function(ip)
    {
        return banned.includes(ip);
    }
}

module.exports = Auth;