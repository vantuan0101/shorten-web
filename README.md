
### URL TEST API THROUGH SWAGGER: 
https://shorten-web.up.railway.app/api/test

### AUTH API:
### LOGIN (POST)
https://shorten-web.up.railway.app/api/v1/auth/login
</br>
- username : string
- password : string

### SIGN UP (POST)
https://shorten-web.up.railway.app/api/v1/auth/signup
</br>
- name : string
- username : string
- password : string


### logout (GET)
https://shorten-web.up.railway.app/api/v1/auth/logout


---
#### CRUD User
https://shorten-web.up.railway.app/api/v1/users
## GET ALL
https://shorten-web.up.railway.app/api/v1/users

## GET BY ID
https://shorten-web.up.railway.app/api/v1/users/6376fa2ced2b7513be75fafc

## POST
https://shorten-web.up.railway.app/api/v1/users

</br>
- name : string
- username : string
- password : string

## PATCH
https://shorten-web.up.railway.app/api/v1/users/6376fa2ced2b7513be75fafc

</br>
- name : string
- username : string
- password : string

## DELETE
https://shorten-web.up.railway.app/api/v1/users/6376fa2ced2b7513be75fafc

---


#### CRUD Shorten Link
https://shorten-web.up.railway.app/api/v1/shorten-link

## GET ALL
https://shorten-web.up.railway.app/api/v1/shorten-link

## GET BY ID
https://shorten-web.up.railway.app/api/v1/shorten-link/6376faa7ed2b7513be75fb00

## POST
https://shorten-web.up.railway.app/api/v1/shorten-link

</br>
- linkToRedirect : string


## PATCH
https://shorten-web.up.railway.app/api/v1/shorten-link/6376faa7ed2b7513be75fb00

</br>
- linkToRedirect : string
- shortLink : string
- countClick : number
- userId : string

## DELETE
https://shorten-web.up.railway.app/api/v1/shorten-link/6376faa7ed2b7513be75fb00

---