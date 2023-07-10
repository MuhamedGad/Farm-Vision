# ML_API

## **Some Notes:**
```
1- token must send in request body with name "x-auth-token"
2- URL of the API "https://test-ml-api.onrender.com"
```

</br>

## **Images Routes:**
### **Process**
Route:
```
/api/imagesModels/process
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| x-auth-token | text | must be valid token | false |
| features | checkboxes | must be an array of our project features selected by user | false |

Response Data:
- message: simple message to feedback

- type: string of type of the plant in the image

- diseases: list of diseases that output from the model

- image: origin image file as base64 string

- resultImage: result image file as base64 string

- confidence: the float number

<br/>

### **Get Images Data (Images History)**
Route:
```
/api/imagesModels
```
Method:
```
GET
```
Response Data:
- message: simple message to feedback

- data: list of objects (id, image, resultImage, type, confidence, diseases, createdAt)

<br/>

### **Get Image Data (One Row Of History)**
Route:
```
/api/imagesModels/:id        -(id) id of image data
```
Method:
```
GET
```
Response Data:
- message: simple message to feedback

- data: one object (id, image, resultImage, type, confidence, diseases, createdAt)

<br/>

### **Delete Image Data (One Row Of History)**
Route:
```
/api/imagesModels/:id        -(id) id of image data
```
Method:
```
DELETE
```
Response Data:
- message: simple message to feedback

<br/>

## **Videos Routes:**
### **Process**
Route:
```
/api/videosModels/process
```
Method:
```
POST
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| x-auth-token | text | must be valid token | false |
| features | checkboxes | must be an array of our project features selected by user | false |

Response Data:
- message: simple message to feedback

- number: the number of fruits

- video: origin video file name

- resultVideo: result video file name

<br/>

### **Get Videos Data (Videos History)**
Route:
```
/api/videosModels
```
Method:
```
GET
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| x-auth-token | text | must be valid token | false |
Response Data:
- message: simple message to feedback

- data: list of objects (id, video, resultVideo, type, number, createdAt)

<br/>

### **Get Video Data (One Row Of History)**
Route:
```
/api/videosModels/:id        -(id) id of image data
```
Method:
```
GET
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| x-auth-token | text | must be valid token | false |
Response Data:
- message: simple message to feedback

- data: one object (id, video, resultVideo, type, number, createdAt)

<br/>

### **Delete Video Data (One Row Of History)**
Route:
```
/api/videosModels/:id        -(id) id of image data
```
Method:
```
DELETE
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| x-auth-token | text | must be valid token | false |
Response Data:
- message: simple message to feedback

<br/>

### **Get Video File**
Route:
```
/api/getVideo/<video>      -(video) is video name
```
Method:
```
GET
```
Form:
| input name | Type | validate | nullable |
|--------|------|-------|--------|
| x-auth-token | text | must be valid token | false |
Response Data:
- video file

<br/>
