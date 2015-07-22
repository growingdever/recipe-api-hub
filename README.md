# recipe-api-main
Software Maestro 6th Project,
Which provides recommedation of recipe with personalized data to users.

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
```
// dirty way is query
/api?access_token=HMSi47aRUmB7DeSKvmlLQpJ7nT3r/hDPfskXdAoOfeeP4ojuWDFZR3tOXylfHdI7

// good way is http header
Authorization: Bearer HMSi47aRUmB7DeSKvmlLQpJ7nT3r/hDPfskXdAoOfeeP4ojuWDFZR3tOXylfHdI7
```
_Dirty way_ can make blueprint API problem. Thus, you should adopt good way always.

### Test
```
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