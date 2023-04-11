# Forms Names

## **Some Notes:**
```
1- token must send in request header with name "x-auth-token"
2- URL of the API "https://farm-vision.onrender.com"
```
---

## **User Routes:**
### **Sign In:**
Route:
```
/api/login
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|--------|-------|
| email | email | must be string | false |
| password | password | must not be less than 8 and must be string | false |
</br>

### **Sign Out:**
Route:
```
/api/logout
```
Method:
```
POST
```
</br>

### **Sign Up:**
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
</br>

### **Get User:**
Route:
```
/api/user/:id       - (:id) means id of user that wanted to get
```
Method:
```
GET
```
</br>

### **Update User:**
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
</br>

### **Delete User:**
Route:
```
/api/user/:id       - (:id) means id of user that wanted to delete
```
Method:
```
DELETE
```
</br>

### **Get Profile Image:**
Route:
```
/api/logo/:id       - (:id) means id of user that is owner of image
```
Method:
```
GET
```
</br>

### **Update Profile Image:**
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
</br>

### **Update Password:**
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
## **Devices that logined Routes:**
### **Get device info**
Route:
```
/api/token/:id        -(id) mean id of device that wanted
```
Method:
```
get
```
</br>

### **Get Devices logined by my account:**
Route:
```
/api/token/
```
Method:
```
get
```
</br>

### **Delete (logout) device that logined:**
Route:
```
/api/token/:id        -(id) mean id of device that wanted
```
Method:
```
delete
```
---
## **Admin Only Routes:**
### **Get All Users:**
Route:
```
/api/admin/user
```
Method:
```
GET
```
</br>

### **Add user by admin:**
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
</br>

### **Update Role of user:**
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
</br>

### **Get all devices on website**
Route:
```
/api/admin/token        -(id) mean id of device that wanted
```
Method:
```
get
```
</br>

### **Get all devices logined by specific user**
Route:
```
/api/admin/token/:id        -(id) mean id of user that wanted
```
Method:
```
get
```
---
## **Post Routes:**
### **Get all posts:**
Route:
```
/api/post
```
Method:
```
get
```
</br>

### **Get posts of specific user:**
Route:
```
/api/post/userposts/:id         -(id) mean id of user that wanted his posts
```
Method:
```
get
```
</br>

### **Get post:**
Route:
```
/api/post/:id        -(id) mean id of post that wanted
```
Method:
```
get
```
</br>

### **Create post:**
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
</br>

### **Update post:**
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
</br>

### **Delete post:**
Route:
```
/api/post/:id        -(id) mean id of post that wanted
```
Method:
```
delete
```
---
## **Comment Routes:**
### **Get comment:**
Route:
```
/api/comment/:id        -(id) mean id of comment that wanted
```
Method:
```
get
```
</br>

### **Get comments of specific post:**
Route:
```
/api/comment/postcomments/:id        -(id) mean id of post that wanted to get its comments
```
Method:
```
get
```
</br>

### **Create comment on post:**
Route:
```
/api/comment/onpost/:id        -(id) mean id of post that wanted to comment on it
```
Method:
```
post
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| content | text | must be between 10-1000 characters | false |
</br>

### **Create comment on comment:**
Route:
```
/api/comment/oncomment/:id        -(id) mean id of comment that wanted to comment on it
```
Method:
```
post
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| content | text | must be between 10-1000 characters | false |
</br>

### **Update comment:**
Route:
```
/api/comment/:id        -(id) mean id of comment that wanted update
```
Method:
```
put
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| content | text | must be between 10-1000 characters | false |
</br>

### **Delete comment:**
Route:
```
/api/comment/:id        -(id) mean id of comment that wanted to deleted
```
Method:
```
delete
```
---