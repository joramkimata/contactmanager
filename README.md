## Login as Admin

```
POST: https://contactmanager-udemy.herokuapp.com/auth/login

Payload:
{
    "username": "admin",
    "password": "admin.2021"
}
```

## User Profile

```
GET: https://contactmanager-udemy.herokuapp.com/auth/profile

Header: Auth: 'Bearer <toke>'
```

## Refresh Token

```
POST: https://contactmanager-udemy.herokuapp.com/auth/refresh

{
    "refreshToken": "<refresh_token>"
}
```

## Logout Endpoint

```
POST: https://contactmanager-udemy.herokuapp.com/auth/logout

{
    "refreshToken": "<refresh_token>"
}
```
