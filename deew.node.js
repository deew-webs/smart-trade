// deew.node v0.0.3
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
class DEEW
{
    GetCookieByName(name)
    {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2)
            return parts.pop().split(';').shift();
        else
            return null;
    }

    IsNumeric(str)
    {
        if (typeof str == "number") return true; // its already a Number!
        if (typeof str != "string" || str.length == 0) return false; // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    LoadURL(link, callback)
    {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", link, false);
        xhr.onload = () =>
        {
            if(xhr.status == 200)
                callback(true, xhr.responseText);
            else
                callback(false, xhr.responseText);
        };
        xhr.onerror = () =>
        {
            callback(false, xhr.responseText);
        };
        xhr.send();
    }

    LoadURL_Async(link)
    {
        return new Promise((resolve, reject) =>
        {
            const http = require('http'), https = require('https');
    
            let client = http;
            if (link.toString().indexOf("https") === 0)
                client = https;
    
            client.get(link, (resp) =>
            {
                let data = '';
    
                // A chunk of data has been recieved.
                resp.on('data', (chunk) =>
                {
                    data += chunk;
                });
    
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    resolve(data);
                });
    
            }).on("error", (err) =>
            {
                reject(err);
            });
        });
    }

    LoadURL_Async_(link)
    {
        return new Promise(callback =>
            {
                let xhr = new XMLHttpRequest();
                xhr.open("GET", link, false);
                xhr.onload = () =>
                {
                    if(xhr.status == 200)
                        callback(xhr.responseText);
                    else
                        callback(xhr.responseText);
                };
                xhr.onerror = () =>
                {
                    callback(xhr.responseText);
                };
                xhr.send();
            });
    }

    PostURL(link, jsonParms, callback)
    {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", link, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () =>
        {
            callback(xhr.status, JSON.parse(xhr.responseText));
        };
        xhr.onerror = () =>
        {
            callback(xhr.status, {});
        };
        xhr.send(JSON.stringify(jsonParms));
    }

    PostURL_Async(link, jsonParms)
    {
        return new Promise(callback =>
            {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", link, false);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onload = () =>
                {
                    callback(xhr.status, JSON.parse(xhr.responseText));
                };
                xhr.onerror = () =>
                {
                    callback(xhr.status, {});
                };
                xhr.send(JSON.stringify(jsonParms));
            });
    }

    ExtToContentType (ext)
    {
        let contentType = 'text/html';
        switch (ext)
        {
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.ico':
                contentType = 'image/ico';
                break;
            case '.txt': case '.ini':
                contentType = 'text/txt';
                break;
            case '.otf':
                contentType = 'font/otf';
                break;
            case '.otf':
                contentType = 'font/otf';
                break;
            case '.ttf':
                contentType = 'font/ttf';
                break;
            case '.woff':
                contentType = 'font/woff';
                break;
            case '.woff2':
                contentType = 'font/woff2';
                break;
            case '.json':
                contentType = 'application/json';
                break;
        }
        return contentType;
    }
}

module.exports = DEEW;