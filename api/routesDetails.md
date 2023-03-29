# Forms Names

## Some Notes:
```
1- token must send in request header with name "x-auth-token"
2- URL of the API "https://smart-farm.onrender.com"
```
---
## Sign In:
**Route**:
```
/api/login
```
**Method**:
```
POST
```
**Form**:
| input name | Type | validate | nullable |
|--------|------|--------|-------|
| email | email | must be string | false |
| password | password | must not be less than 8 and must be string | false |
---
## Sign Out:
**Route**:
```
/api/logout
```
**Method**:
```
POST
```
----
## Sign Up:
**Route**:
```
/api/user
```
**Method**:
```
POST
```
**Form**:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| firstName | text | must be string | false |
| lastName | text | must be string | false |
| email | email | must be string | false |
| password | password | must not be less than 8 and must be string | false |
| confirmPassword | password | must not be less than 8 and must be string | false |
| address | text | must be string | false |
| phoneNumber | number | must be number | false |
| devicesNumber | number | must be number and default=5 | true |
---
## Get User:
**Route**:
```
/api/user/:id       - (:id) means id of user that wanted to get
```
**Method**:
```
GET
```
---
## Get All Users:
**Route**:
```
/api/user
```
**Method**:
```
GET
```
----
## Update User:
**Route**:
```
/api/user/:id       - (:id) means id of user that wanted to update
```
**Method**:
```
PUT
```
**Form**:
| input name | Type | validate| nullable |
|--------|------|--------|---------|
| firstName | text | must be string | false |
| lastName | text | must be string | false |
| email | email | must be string | false |
| address | text | must be string | false |
| phoneNumber | number | must be number | false |
| devicesNumber | number | must be number and default = 5 | true |
----
## Delete User:
**Route**:
```
/api/user/:id       - (:id) means id of user that wanted to delete
```
**Method**:
```
DELETE
```
---
## Get Profile Image:
**Route**:
```
/api/logo/:id       - (:id) means id of user that is owner of image
```
**Method**:
```
GET
```
---
## Update Profile Image:
**Route**:
```
/api/logo/:id       - (:id) means id of user that is owner of image
```
**Method**:
```
PUT
```
**Form**:
| input name | Type |
|--------|------|
| image | file |
---
## Update Admin:
**Route**:
```
/api/admin/:id       - (:id) means id of user that wanted to change its administration
```
**Method**:
```
PUT
```
---
## Add user by admin:
**Route**:
```
/api/admin
```
**Method**:
```
POST
```
**Form**:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| firstName | text | must be string | false |
| lastName | text | must be string | false |
| email | email | must be string | false |
| password | password | must not be less than 8 and must be string | false |
| confirmPassword | password | must not be less than 8 and must be string | false |
| address | text | must be string | false |
| phoneNumber | number | must be number | false |
| admin | checkbox | must be boolean & default false | true |
| devicesNumber | number | must be number and default=5 | true |
---
## Update Password:
**Route**:
```
/api/password/:id       - (:id) means id of user that is owner of password
```
**Method**:
```
PUT
```
**Form**:
| input name | Type | validate | nullable |
|--------|------|------|-------|
| oldPassword | password | must not be less than 8 and must be string | false |
| password | password | must not be less than 8 and must be string | false |
| confirmPassword | password | must not be less than 8 and must be string | false |
---