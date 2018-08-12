# Environment file

On local we have in the root folder a file named `development.env` which is
loaded by docker to determine what values should be loaded in the environment.

This is also done on production but with a file named `production.env`.

> **SECURITY WARNING**
> 
> The files `development.env` and `production.env` are never commited in the
> repository. This is because they contain values that should be kept a secret.


## Example of .env file

```
SENDGRID_API_KEY=??????
HOST_WEB=https://www.thennext.com/
```

* `SENDGRID_API_KEY` is the API key used for SendGrid
* `HOST_WEB` is the full url of the domain. In the above example it is the
  production environment. 

