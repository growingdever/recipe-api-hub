# recipe-api-main
Software Maestro 6th Project,
Which provides recommedation of recipe with personalized data to users.

## Deployed Server
[Server on Heroku](https://recipe-main.herokuapp.com)

*Before reading* 
1. Start with '*/*' means almost URL 'http://domain.something.blah/'
2. Sometimes it's wrong. In the case, if you know then you already know what's wrong. Don't ask and fix yourself.

## Deploy Local Server
```sh
# get repository
git clone git@github.com:soma-6th/recipe-api-main.git
cd recipe-api-main

# needs node.js
npm install
npm start
```

## Development Functions
```
/register // can sign up
```

## Authenticate
To authenticate, it uses bearer. No need to send username and password parameter to authenticate.

### Get Accesss Token
```
/auth/getAccessToken?identifier={{username}}&password={{password}}
```
will provide accessToken as JSON type as below:
```
{
  "accessToken": "HMSi47aRUmB7DeSKvmlLQpJ7nT3r/hDPfskXdAoOfeeP4ojuWDFZR3tOXylfHdI7"
}
```
Save token to authenticate.

### Send Access Token
```sh
# dirty way is query
/api?access_token=HMSi47aRUmB7DeSKvmlLQpJ7nT3r/hDPfskXdAoOfeeP4ojuWDFZR3tOXylfHdI7

# good way is http header
Authorization: Bearer HMSi47aRUmB7DeSKvmlLQpJ7nT3r/hDPfskXdAoOfeeP4ojuWDFZR3tOXylfHdI7
```
_Dirty way_ can make blueprint API problem. Thus, you should adopt good way always.

### Test
```
Target URL
/users/me

// without accessToken
Unauthorized

// with accessToken
{
  "username": "beingbook",
  "email": "beingbook@gmail.com",
  "id": 1,
  "createdAt": "2015-07-21T17:18:17.919Z",
  "updatedAt": "2015-07-21T17:18:17.919Z"
}
```