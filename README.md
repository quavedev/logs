# quave:logs

`quave:logs` is a Meteor package that allows you to send logs to loggly, from client and server.

## Why

Every application needs log and we take advantage of Meteor methods to also send logs from the client.

We believe we are not reinventing the wheel in this package but what we are doing is like putting together the wheels in the vehicle :).

## Installation

```sh
meteor add quave:logs
meteor npm install winston-loggly-bulk
```

## Usage

You need to configure this package using your settings.

You have two important fields:
- `sendToServer`: define the levels that are going to the server from client logs
- `loggly`: `token`, `subdomain` and `tags` to configure loggly 
```
{
  "public": {
    "env": "DEVELOPMENT",
    "packages": {
      "quave:logs": {
        "sendToServer": [
          "error",
          "warn"
        ],
        "loggly": {
          "token": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx",
          "subdomain": "yourdomain",
          "tags": [
            "myproject"
          ]
        }
      }
    }
  }
}

```

We have three methods in the logger object:
- info
- warn
- error

they all receive:
- message: text
- error: error object
- tags: array of tags

Now you are ready to use `quave:logs`, as we don't want to include server dependencies in the client we need to use a different import in the client.

See one example for server and one for client below. 

On server
```javascript
import { logger } from 'meteor/quave:logs/logger';

client.sendEmail(
    options,
    error => {
      if (error) {
        logger.error({
          message: `Error while sending email=${JSON.stringify(options)}, to=${
            options.to.email
          }`,
          error,
          tags: ['email'],
        });
      }
    }
);
```

On client
```javascript
import { loggerClient } from 'meteor/quave:logs/loggerClient';

if (Meteor.userId) {
  loggerClient.info({message: `logged user id ${Meteor.userId}`});
}
```

If you have your environment on `Meteor.settings.public.env` it will be sent as a tag automatically.

## Limitations
We are using [loggly](https://www.loggly.com/) because we like this tool then for now we only support sending logs to loggly. If you don't want to send to anywhere, you can just omit this setting. Also, if you want to support more tools you can submit a PR.

### License

MIT
