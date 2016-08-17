Screencloud Token Upload Server
===============================

**screencloud-tokenupload-server** is a node endpoint implementation for the [screencloud-tokenupload plugin](https://github.com/RezzedUp/screencloud-tokenupload).

### Requires:

- Node.js
- NPM
- Tmux or Screen *(to keep server alive)* 
- Nginx *(optional)*

Installation
------------

| Step # |                                                                                        |
|--------|----------------------------------------------------------------------------------------|
|   1    | Either clone this repository or download the repository as a zip.                      |
|        | `git clone https://github.com/RezzedUp/screencloud-tokenupload-server.git`             |
|   2    | `cd screencloud-tokenupload-server`                                                    |
|        | `npm install`                                                                          |
|   3    | Configure **config.json**                                                              |
|   4    | Start a new Tmux or Screen session                                                     |
|   5    | `npm start`                                                                            |

By default, screencloud-tokenupload-server is set to bind to localhost and be accessed behind a proxy. This is the recommended way to go if you want your server instance to run on port 80.

Example nginx config
--------------------

```nginx
server
{
    listen 80;

    server_name your.domain www.your.domain;

    location /
    {
        client_max_body_size 5M;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_pass http://localhost:3000;
    }
}

```
