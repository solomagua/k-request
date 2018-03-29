k-request
===========

`npm install k-request`

Basic Usage
-----

```javascript
const KR = require('k-request');
global.KR = new KR(process.env.mongo_uri, 'porjectId');

const options = {
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  method: 'GET'
}
global.KR.request(options, (error, response, body) => {
  console.log('error', error);
  console.log('response', response);
  console.log('body', body);
  // Etcétera...
});
```

Result
------

**projectId-request collection**:
```json
[
  {
      "_id": {
          "$oid": "5abd0b1f937a0d55403c7193"
      },
      "projectId": "jasmine-test",
      "callerFile": "/home/solomagua/github/k-request/spec/k-request-spec.js",
      "options": {
          "url": "https://jsonplaceholder.typicode.com/posts/1",
          "method": "GET"
      },
      "_createdAt": {
          "$date": "2018-03-29T15:49:52.674Z"
      }
  }
]
```

**projectId-response collection**:
```json
[
  {
    "_id": {
        "$oid": "5abd0b20937a0d55403c7195"
    },
    "request": {
        "$oid": "5abd0b1f937a0d55403c7193"
    },
    "error": null,
    "response": {
        "statusCode": 200,
        "body": "{\n  \"userId\": 1,\n  \"id\": 1,\n  \"title\": \"sunt aut facere repellat provident occaecati excepturi optio reprehenderit\",\n  \"body\": \"quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto\"\n}",
        "headers": {
            "date": "Thu, 29 Mar 2018 15:49:52 GMT",
            "content-type": "application/json; charset=utf-8",
            "content-length": "292",
            "connection": "close",
            "set-cookie": [
                "__cfduid=d7c222d08552e7978d0e6165bdb23f05a1522338592; expires=Fri, 29-Mar-19 15:49:52 GMT; path=/; domain=.typicode.com; HttpOnly"
            ],
            "x-powered-by": "Express",
            "vary": "Origin, Accept-Encoding",
            "access-control-allow-credentials": "true",
            "cache-control": "public, max-age=14400",
            "pragma": "no-cache",
            "expires": "Thu, 29 Mar 2018 19:49:52 GMT",
            "x-content-type-options": "nosniff",
            "etag": "W/\"124-yiKdLzqO5gfBrJFrcdJ8Yq0LGnU\"",
            "via": "1.1 vegur",
            "cf-cache-status": "HIT",
            "expect-ct": "max-age=604800, report-uri=\"https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct\"",
            "server": "cloudflare",
            "cf-ray": "40337d2dbe2a67b5-EZE"
        },
        "request": {
            "uri": {
                "protocol": "https:",
                "slashes": true,
                "auth": null,
                "host": "jsonplaceholder.typicode.com",
                "port": 443,
                "hostname": "jsonplaceholder.typicode.com",
                "hash": null,
                "search": null,
                "query": null,
                "pathname": "/posts/1",
                "path": "/posts/1",
                "href": "https://jsonplaceholder.typicode.com/posts/1"
            },
            "method": "GET"
        }
    },
    "body": "{\n  \"userId\": 1,\n  \"id\": 1,\n  \"title\": \"sunt aut facere repellat provident occaecati excepturi optio reprehenderit\",\n  \"body\": \"quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto\"\n}",
    "_createdAt": {
        "$date": "2018-03-29T15:49:52.966Z"
    }
  }
]
```

LOG Parameter
-------------

**Log Errors**

```javascript
const KR = require('k-request');
global.KR = new KR(process.env.mongo_uri, 'porjectId');

const options = {
  url: 'https://jsonplaceholder.typicode.com/posts/2',
  method: 'GET',
  LOG: {
      TYPE: KR.ERROR
  }
}
global.KR.request(options, (error, response, body) => {
  if (error)
    console.log('Logs must be in the database...')
});
```

**Log Status Code >= 500**

```javascript
const KR = require('k-request');
global.KR = new KR(process.env.mongo_uri, 'porjectId');

const options = {
  url: 'https://jsonplaceholder.typicode.com/posts/3',
  method: 'GET',
  LOG: {
      TYPE: KR.STATUS_CODE_GE,
      ARG: 500
  }
}
global.KR.request(options, (error, response, body) => {
  if (response.statusCode >= 500)
    console.log('Logs must be in the database...')
});
```

**Log Status Code != 200**

```javascript
const KR = require('k-request');
global.KR = new KR(process.env.mongo_uri, 'porjectId');

const options = {
  url: 'https://jsonplaceholder.typicode.com/posts/3',
  method: 'GET',
  LOG: {
      TYPE: KR.STATUS_CODE_NE,
      ARG: 200
  }
}
global.KR.request(options, (error, response, body) => {
  if (response.statusCode != 200)
    console.log('Logs must be in the database...')
});
```
LOG Types
-------------

- ANY
- ERROR
- STATUS_CODE_EQ *(ARG required)*
- STATUS_CODE_NE *(ARG required)*
- STATUS_CODE_GE *(ARG required)*
- STATUS_CODE_GT *(ARG required)*
- STATUS_CODE_LE *(ARG required)*
- STATUS_CODE_LT *(ARG required)*

License
-------------
MIT
