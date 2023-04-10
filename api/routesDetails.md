# Forms Names

## **Some Notes:**
```
1- token must send in request header with name "x-auth-token"
2- URL of the API "https://farm-vision.onrender.com"
```
---
## **Sign In:**
### Route:
```
/api/login
```
### Method:
```
POST
```
### Form:
| input name | Type | validate | nullable |
|--------|------|--------|-------|
| email | email | must be string | false |
| password | password | must not be less than 8 and must be string | false |
---
## **Sign Out:**
Route:
```
/api/logout
```
Method:
```
POST
```
----
## **Sign Up:**
Route:
```
/api/user
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| firstName | text | must be string | false |
| lastName | text | must be string | false |
| email | email | must be string | false |
| password | password | must not be less than 8 and must be string | false |
| confirmPassword | password | must not be less than 8 and must be string | false |
| role | text | must be one of this (farmer, engineer) | false |
| phoneNumber | number | must be number and less than 11 | false |
| devicesNumber | number | must be number and default=5 | true |
| workField | text | must be string | false |
| usageTarget | text | must be string | false |
| streetName | text | must be string | false |
| city | text | must be string | false |
| state | text | must be string | false |
| country | text | must be string | false |
| postCode | text | must be string | false |
| features | checkboxes | must be an array of our project features selected by user | true |
---
## **Get User:**
Route:
```
/api/user/:id       - (:id) means id of user that wanted to get
```
Method:
```
GET
```
---
## **Get All Users:**
Route:
```
/api/admin/user
```
Method:
```
GET
```
---
## **Update User:**
Route:
```
/api/user/:id       - (:id) means id of user that wanted to update
```
Method:
```
PUT
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| firstName | text | must be string | false |
| lastName | text | must be string | false |
| email | email | must be string | false |
| role | text | must be one of this (farmer, engineer) | false |
| phoneNumber | number | must be number must be number and less than 11 | false |
| devicesNumber | number | must be number and default=5 | true |
| workField | text | must be string | false |
| usageTarget | text | must be string | false |
| streetName | text | must be string | false |
| city | text | must be string | false |
| state | text | must be string | false |
| country | text | must be string | false |
| postCode | text | must be string | false |
| features | checkboxes | must be an array of our project features selected by user | true |
----
## **Delete User:**
Route:
```
/api/user/:id       - (:id) means id of user that wanted to delete
```
Method:
```
DELETE
```
---
## **Get Profile Image:**
Route:
```
/api/logo/:id       - (:id) means id of user that is owner of image
```
Method:
```
GET
```
---
## **Update Profile Image:**
Route:
```
/api/logo/:id       - (:id) means id of user that is owner of image
```
Method:
```
PUT
```
Form:
| input name | Type |
|--------|------|
| image | file |
---
## **Update Password:**
Route:
```
/api/password/:id       - (:id) means id of user that is owner of password
```
Method:
```
PUT
```
Form:

- if you are owner:

    | input name | Type | validate | nullable |
    |--------|------|------|-------|
    | oldPassword | password | must not be less than 8 and must be string | false |
    | password | password | must not be less than 8 and must be string | false |
    | confirmPassword | password | must not be less than 8 and must be string | false |

- if you are admin:
    | input name | Type | validate | nullable |
    |--------|------|------|-------|
    | password | password | must not be less than 8 and must be string | false |
    | confirmPassword | password | must not be less than 8 and must be string | false |
---
## **Update Role of user:**
Route:
```
/api/admin/user/:id       - (:id) means id of user that wanted to change its role
```
Method:
```
PUT
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| role | text | must be one of this (farmer, engineer, admin, superAdmin) | false |
---
## **Add user by admin:**
Route:
```
/api/admin/user
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| firstName | text | must be string | false |
| lastName | text | must be string | false |
| email | email | must be string | false |
| password | password | must not be less than 8 and must be string | false |
| confirmPassword | password | must not be less than 8 and must be string | false |
| role | text | must be one of this (admin, superAdmin, farmer, engineer) | false |
| phoneNumber | number | must be number must be number and less than 11 | false |
| devicesNumber | number | must be number and default=5 | true |
| workField | text | must be string | false |
| usageTarget | text | must be string | false |
| streetName | text | must be string | false |
| city | text | must be string | false |
| state | text | must be string | false |
| country | text | must be string | false |
| postCode | text | must be string | false |
| features | checkboxes | must be an array of our project features selected by user | true |
---
## **Get device info**
Route:
```
/api/token/:id        -(id) mean id of device that wanted
```
Method:
```
get
```
---
## **Get Devices logined by my account:**
Route:
```
/api/token/
```
Method:
```
get
```
---
## **Delete(logout) device that logined:**
Route:
```
/api/token/:id        -(id) mean id of device that wanted
```
Method:
```
delete
```
---
## **Get all devices of website**
Route:
```
/api/admin/token        -(id) mean id of device that wanted
```
Method:
```
get
```
---
## **Get all devices logined by specific user**
Route:
```
/api/admin/token/:id        -(id) mean id of user that wanted
```
Method:
```
get
```
---
## **Get all posts:**
Route:
```
/api/post
```
Method:
```
get
```
---
## **Get posts of specific user:**
Route:
```
/api/post/userposts/:id         -(id) mean id of user that wanted his posts
```
Method:
```
get
```
---
## **Get post:**
Route:
```
/api/post/:id        -(id) mean id of post that wanted
```
Method:
```
get
```
---
## **Create post:**
Route:
```
/api/post/:id        -(id) mean id of post that wanted
```
Method:
```
get
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| content | text | must be between 10-1000 characters | false |
---
## **Update post:**
Route:
```
/api/post/:id        -(id) mean id of post that wanted
```
Method:
```
get
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| content | text | must be between 10-1000 characters | false |
---
## **Delete post:**
Route:
```
/api/post/:id        -(id) mean id of post that wanted
```
Method:
```
delete
```