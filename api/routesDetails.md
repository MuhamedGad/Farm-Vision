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
| userName | text | must be string with only small characters and starting with character | false |
| email | email | must be string | false |
| password | password | must not be less than 8 and must be string | false |
| confirmPassword | password | must not be less than 8 and must be string | false |
| role | text | must be one of this (farmer, engineer) | false |
| phoneNumber | number | must be number in string datatype | false |
| workField | text | must be string | false |
| usageTarget | text | must be string | false |
| streetName | text | must be string | false |
| city | text | must be string | false |
| state | text | must be string | false |
| country | text | must be string | false |
| postCode | text | must be string | false |
| image | file | logo of user | true |

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
| firstName | text | must be string | true |
| lastName | text | must be string | true |
| userName | text | must be string with only small characters and must larger than 8 characters | true |
| email | email | must be string | true |
| role | text | must be one of this (farmer, engineer) | true |
| phoneNumber | number | must be number in string datatype  | true |
| workField | text | must be string | true |
| usageTarget | text | must be string | true |
| streetName | text | must be string | true |
| city | text | must be string | true |
| state | text | must be string | true |
| country | text | must be string | true |
| postCode | text | must be string | true |
| image | file | logo of user | true |

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
GET
```
</br>

### **Get Devices logined by my account:**
Route:
```
/api/token
```
Method:
```
GET
```
</br>

### **Delete (logout) device that logined:**
Route:
```
/api/token/:id        -(id) mean id of device that wanted
```
Method:
```
DELETE
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
| userName | text | must be string with only small characters and larger than 8 characters | false |
| email | email | must be string | false |
| password | password | must not be less than 8 and must be string | false |
| confirmPassword | password | must not be less than 8 and must be string | false |
| role | text | must be one of this (admin, superAdmin, farmer, engineer) | false |
| phoneNumber | number | must be number in string datatype | false |
| workField | text | must be string | false |
| usageTarget | text | must be string | false |
| streetName | text | must be string | false |
| city | text | must be string | false |
| state | text | must be string | false |
| country | text | must be string | false |
| postCode | text | must be string | false |
| image | file | logo of user | true |

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
GET
```
</br>

### **Get all devices logined by specific user**
Route:
```
/api/admin/token/:id        -(id) mean id of user that wanted
```
Method:
```
GET
```
</br>

### **Add feature:**
Route:
```
/api/feature
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| feature | text | minimum length 3 characters and must be small chars with no spaces | false |
| describtion | text | minimum length 10 characters | false |
| price | number | must be number | false |
| type | selectbox | must be "image", "video" or "other" | false |

</br>

### **update feature:**
Route:
```
/api/feature/:id        -(id) mean id of feature that wanted
```
Method:
```
PUT
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| feature | text | minimum length 3 characters and must be small chars with no spaces | true |
| describtion | text | minimum length 10 characters | true |
| price | number | must be number | true |
| type | selectbox | must be "image", "video" or "other" | true |

</br>

### **Delete feature:**
Route:
```
/api/feature/:id        -(id) mean id of feature that wanted
```
Method:
```
DELETE
```
</br>

### **Add tag:**
Route:
```
/api/tag
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| tag | text | minimum length 3 characters and must be small chars with no spaces | false |
| describtion | text | minimum length 10 characters | false |
</br>

### **update tag:**
Route:
```
/api/tag/:id        -(id) mean id of tag that wanted
```
Method:
```
PUT
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| tag | text | minimum length 3 characters and must be small chars with no spaces | true |
| describtion | text | minimum length 10 characters | true |
</br>

### **Delete tag:**
Route:
```
/api/tag/:id        -(id) mean id of tag that wanted
```
Method:
```
DELETE
```
</br>

### **Get requested tags:**
Route:
```
/api/tag/getTagRequests
```
Method:
```
GET
```
</br>

### **Accept requested tag:**
Route:
```
/api/tag/acceptTagRequest/:id        -(id) mean id of tag that wanted
```
Method:
```
PUT
```
</br>

### **Reject requested tag:**
Route:
```
/api/tag/rejectTagRequest/:id        -(id) mean id of tag that wanted
```
Method:
```
PUT
```
---
<br>

### **Get All Reports**
Route:
```
/api/report
```
Method:
```
GET
```
---
<br>

### **Get All Payments**
Route:
```
/api/subscribe
```
Method:
```
GET
```

<br/>

## **Post Routes:**
### **Get all posts:**
Route:
```
/api/post
```
Method:
```
GET
```
Response:
```
message: "Found posts."
length: posts number
data: list of PostsData each postData => {post, images, tags, user, userLike, userDisLike}
- post => {id, content, createdAt, updatedAt, UserId}
- images => list of images
- tags => list of tags
- user => {userName, firstName, lastName, role} the user that own the post
- userLike: if user like the post or not
- userDisLike: if user dislike the post or not
```
</br>

### **Get posts of specific user:**
Route:
```
/api/post/userposts/:id         -(id) mean id of user that wanted his posts
```
Method:
```
GET
```
Response:
```
message: "Found posts."
length: posts number
user:{userName, firstName, lastName, role} owner of the post
data: list of PostsData each postData => {post, images, tags, userLike, userDisLike}
- post => {id, content, createdAt, updatedAt, UserId}
- images => list of images
- tags => list of tags
- userLike: if user like the post or not
- userDisLike: if user dislike the post or not
```
</br>

### **Get posts of specific tag:**
Route:
```
/api/post/tagposts/:id         -(id) mean id of tag that wanted its posts
```
Method:
```
GET
```
Response:
```
message: "Found posts."
length: posts number
data: list of PostsData each postData => {post, images, tags, user, userLike, userDisLike}
- post => {id, content, createdAt, updatedAt, UserId}
- images => list of images
- tags => list of tags
- user => {userName, firstName, lastName, role}  owner of the post
- userLike: if user like the post or not
- userDisLike: if user dislike the post or not
```
</br>

### **Get post:**
Route:
```
/api/post/:id        -(id) mean id of post that wanted
```
Method:
```
GET
```
Response:
```
message: "Post Found."
data: PostData => {post, images, tags, user, userLike, userDisLike}
- post => {id, content, createdAt, updatedAt, UserId}
- images => list of images
- tags => list of tags
- user => {userName, firstName, lastName, role}
- userLike: if user like the post or not
- userDisLike: if user dislike the post or not
```
</br>

### **Create post:**
Route:
```
/api/post
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| content | text | must be between 10-1000 characters | false |
| tags | checkboxes | must be array of valid tags that saved | false |
| images | file | images of post | true |

Response:
```
message: "Post created successfully.",
id: postId
```
</br>

### **Update post:**
Route:
```
/api/post/:id        -(id) mean id of post that wanted
```
Method:
```
PUT
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| content | text | must be between 10-1000 characters | false |
| tags | checkboxes | must be array of valid tags that saved | true |
| images | file | images of post | true |

Response:
```
message: "Post updated successfully."
```
</br>

### **Delete post:**
Route:
```
/api/post/:id        -(id) mean id of post that wanted
```
Method:
```
DELETE
```
Response:
```
message: "Post Deleted Successfully."
```
</br>

### **Like or Unlike post:**
Route:
```
/api/post/like/:id        -(id) mean id of post that wanted
```
Method:
```
POST
```
Response:
```
message: "Liked." or "Unliked."
liked: true for like or false for unlike
```
</br>

### **DisLike or UnDislike post:**
Route:
```
/api/post/dislike/:id        -(id) mean id of post that wanted
```
Method:
```
POST
```
Response:
```
message: "DisLiked." or "UnDisLiked."
disLiked: true for DisLiked or false for UnDisLiked
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
GET
```
Response:
```
message: "Comment Found.",
user: {userName, firstName, lastName, role} comment owner
userLike: if user like the post or not
userDisLike: if user dislike the post or not
data: commentData => {comment, images}
- comment => {id, content, createdAt, updatedAt, UserId}
- images => list of images
```
</br>

### **Get comments of specific post:**
Route:
```
/api/comment/postcomments/:id        -(id) mean id of post that wanted to get its comments
```
Method:
```
GET
```
Response:
```
message: "Found comments."
length: comments number
data: list of CommentsData each commentData => {comment, images, user, userLike, userDisLike}
- comment => {id, content, createdAt, updatedAt, UserId}
- images => list of images
- user => {userName, firstName, lastName, role}
- userLike: if user like the post or not
- userDisLike: if user dislike the post or not
```
</br>

### **Create comment on post:**
Route:
```
/api/comment/onpost/:id        -(id) mean id of post that wanted to comment on it
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| content | text | must be between 1-1000 characters | false |
| images | file | images of comment | true |

Response:
```
message: "Comment created successfully.",
id: commentId
```
</br>

### **Create comment on comment:**
Route:
```
/api/comment/oncomment/:id        -(id) mean id of comment that wanted to comment on it
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| content | text | must be between 1-1000 characters | false |
| images | file | images of comment | true |

Response:
```
message: "Comment created successfully.",
id: commentId
```
</br>

### **Update comment:**
Route:
```
/api/comment/:id        -(id) mean id of comment that wanted update
```
Method:
```
PUT
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| content | text | must be between 1-1000 characters | true |
| images | file | images of comment | true |

Response:
```
message: "Comment updated successfully.",
id: commentId
```
</br>

### **Delete comment:**
Route:
```
/api/comment/:id        -(id) mean id of comment that wanted to deleted
```
Method:
```
DELETE
```
Response:
```
message: "Comment Deleted successfully.",
id: commentId
```
</br>

### **Like or Unlike comment:**
Route:
```
/api/comment/like/:id        -(id) mean id of comment that wanted to like or unlike
```
Method:
```
POST
```
Response:
```
message: "Liked." or "Unliked."
liked: true for like or false for unlike
```
</br>

### **DisLike or UnDislike comment:**
Route:
```
/api/comment/dislike/:id        -(id) mean id of comment that wanted to like or unlike
```
Method:
```
POST
```
Response:
```
message: "DisLiked." or "UnDisLiked."
disLiked: true for DisLiked or false for UnDisLiked
```
---

## **Feature Routes:**
### **Get all features:**
Route:
```
/api/feature
```
Method:
```
GET
```
</br>

### **Get feature:**
Route:
```
/api/feature/:id        -(id) mean id of feature that wanted
```
Method:
```
GET
```
</br>

### **Get my features:**
Route:
```
/api/feature/getUserFeatures
```
Method:
```
GET
```

</br>

### **Get my unsubscribed features:**
Route:
```
/api/feature/getUnsubscribedFeatures
```
Method:
```
GET
```

</br>

### **Cancel Register From Feature**
Route:
```
/api/feature/deleteUserFeature/:id      -(id) is id of feature
```
Method:
```
DELETE
```
---

## **Tag Routes:**
### **Get all Tags:**
Route:
```
/api/tag
```
Method:
```
GET
```
</br>

### **Get tag:**
Route:
```
/api/tag/:id        -(id) mean id of tag that wanted
```
Method:
```
GET
```
Response:
```
message: "Tag Found."
data: tagData=>{tag, describtion, numberOfPosts}
```
</br>

### **Add tag request:**
Route:
```
/api/tag/addTagRequest
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| tag | text | minimum length 3 characters and must be small chars with no spaces | false |
| describtion | text | minimum length 10 characters | false |

Response:
```
message: "Tag requested successfully."
id: tagId
```
---

## **Report Routes:**
### **Create Report:**
Route:
```
/api/report
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| title | text | minimum length 5 characters and maxmum length 30 | false |
| describtion | text | minimum length 10 characters and maxmum length 1000 | false |
| type | selectbox | is "feedback" or "error" | false |

<br>

### **Update Report:**
Route:
```
/api/report/:id       -(id) is the report id
```
Method:
```
PUT
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| title | text | minimum length 5 characters and maxmum length 30 | true |
| describtion | text | minimum length 10 characters and maxmum length 1000 | true |
| type | selectbox | is "feedback" or "error" | true |

<br>

### **Get my Reports:**
Route:
```
/api/report/getMyReports
```
Method:
```
GET
```
<br>

### **Get Report:**
Route:
```
/api/report/:id       -(id) is the report id
```
Method:
```
GET
```
<br>

### **Delete Report:**
Route:
```
/api/report/:id       -(id) is the report id
```
Method:
```
DELETE
```
---

## **Subscribe Routes:**
### **Add Payment (Subscribe)**
Route:
```
/api/subscribe
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| features | checkboxes | must be an array of our project features selected by user | false |

<br/>

### **Get User Payments**
Route:
```
/api/subscribe/getMyPayments
```
Method:
```
GET
```

<br/>

### **Get Publishable key**
Route:
```
/api/subscribe/getPublishabeKey
```
Method:
```
GET
```

<br/>

### **Get Payment Py Id**
Route:
```
/api/subscribe/:id      -id of payment
```
Method:
```
GET
```