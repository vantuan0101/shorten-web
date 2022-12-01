## DEMO ON REACTJS

[https://shorten-client.vercel.app/](https://shorten-client.vercel.app/)


### URL TEST API THROUGH SWAGGER: 

[https://shorten-web.up.railway.app/api/test](https://shorten-web.up.railway.app/api/test)

### Redirect Link (GET)

[https://shorten-web.up.railway.app/api/link/:shortedUrl](https://shorten-web.up.railway.app/api/link/:shortedUrl)

- `/:shortedUrl` : là chuỗi shorted của url cần rút gọn

### Get All User Include Shorted Url (GET)

[https://shorten-web.up.railway.app/api/link/users](https://shorten-web.up.railway.app/api/link/users)

### Get User By Id Include Shorted Url (GET)

[https://shorten-web.up.railway.app/api/link/user/:id](https://shorten-web.up.railway.app/api/link/user/:id)

### AUTH API:
### LOGIN (POST)

[https://shorten-web.up.railway.app/api/v1/auth/login](https://shorten-web.up.railway.app/api/v1/auth/login)
</br>
- `username` : string
- `password` : string

### LOGIN FACEBOOK

[https://shorten-web.up.railway.app/api/v1/auth/facebook](https://shorten-web.up.railway.app/api/v1/auth/facebook)
</br>

### LOGIN GOOGLE

[https://shorten-web.up.railway.app/api/v1/auth/google](https://shorten-web.up.railway.app/api/v1/auth/google)
</br>

### SIGN UP (POST)

[https://shorten-web.up.railway.app/api/v1/auth/signup](https://shorten-web.up.railway.app/api/v1/auth/signup)
</br>
- `name` : string
- `username` : string
- `password` : string


### logout (GET)

[https://shorten-web.up.railway.app/api/v1/auth/logout](https://shorten-web.up.railway.app/api/v1/auth/logout)


---
#### CRUD User

[https://shorten-web.up.railway.app/api/v1/users](https://shorten-web.up.railway.app/api/v1/users)
## GET ALL

[https://shorten-web.up.railway.app/api/v1/users](https://shorten-web.up.railway.app/api/v1/users)

## GET BY ID

[https://shorten-web.up.railway.app/api/v1/users/6376fa2ced2b7513be75fafc](https://shorten-web.up.railway.app/api/v1/users/6376fa2ced2b7513be75fafc)

## POST

[https://shorten-web.up.railway.app/api/v1/users](https://shorten-web.up.railway.app/api/v1/users)

</br>
- `name` : string </br>
- `username` : string </br>
- `password` : string </br>

## PATCH

[https://shorten-web.up.railway.app/api/v1/users/6376fa2ced2b7513be75fafc](https://shorten-web.up.railway.app/api/v1/users/6376fa2ced2b7513be75fafc)

</br>
- `name` : string </br>
- `username` : string</br>
- `password` : string</br>

## DELETE
[https://shorten-web.up.railway.app/api/v1/users/6376fa2ced2b7513be75fafc](https://shorten-web.up.railway.app/api/v1/users/6376fa2ced2b7513be75fafc)

---


#### CRUD Shorten Link

[https://shorten-web.up.railway.app/api/v1/shorten-link](https://shorten-web.up.railway.app/api/v1/shorten-link)

## GET ALL

[https://shorten-web.up.railway.app/api/v1/shorten-link](https://shorten-web.up.railway.app/api/v1/shorten-link)

## GET BY ID

[https://shorten-web.up.railway.app/api/v1/shorten-link/6376faa7ed2b7513be75fb00](https://shorten-web.up.railway.app/api/v1/shorten-link/6376faa7ed2b7513be75fb00)

## POST

[https://shorten-web.up.railway.app/api/v1/shorten-link](https://shorten-web.up.railway.app/api/v1/shorten-link)

</br>
- `linkToRedirect` : string


## PATCH
[https://shorten-web.up.railway.app/api/v1/shorten-link/6376faa7ed2b7513be75fb00](https://shorten-web.up.railway.app/api/v1/shorten-link/6376faa7ed2b7513be75fb00)

</br>
- `linkToRedirect` : string </br>
- `shortLink` : string </br>
- `countClick` : number </br>
- `userId` : string </br>

## DELETE

[https://shorten-web.up.railway.app/api/v1/shorten-link/6376faa7ed2b7513be75fb00](https://shorten-web.up.railway.app/api/v1/shorten-link/6376faa7ed2b7513be75fb00)

---