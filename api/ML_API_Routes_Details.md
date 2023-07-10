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

<br/>

<!-- 
## **Disease Detection Model:**
### Route:
```
/api/imagesModel/diseaseDetection
```
### Method:
```
POST
```
### Form Send Data:
| input name | Type |
|--------|------|
| image | file |
| x-auth-token | text |
### Response Data:
- diseases: list of diseases that output from the model

- image: name of the origin image

- resultImage: name of result image

- Hint: if you want to get image or resultImage go to this route "/api/getImage/:image"  image => is image name that i sent to you

</br>

## **Plant Classfication Model:**
### Route:
```
/api/imagesModel/plantClassification
```
### Method:
```
POST
```
### Form Send Data:
| input name | Type |
|--------|------|
| image | file |
| x-auth-token | text |
### Response Data:
- type: string of type of the plant in the image

- image: name of the origin image

- Hint: if you want to get image go to this route "/api/getImage/:image"  image => is image name that i sent to you

</br>

## **Disease Detection And Plant Classfication Model:**
### Route:
```
/api/imagesModel/diseaseDetectionAndPlantClassification
```
### Method:
```
POST
```
### Form Send Data:
| input name | Type |
|--------|------|
| image | file |
| x-auth-token | text |
### Response Data:
- type: string of type of the plant in the image

- diseases: list of diseases that output from the model

- image: name of the origin image

- resultImage: name of result image

- Hint: if you want to get image go to this route "/api/getImage/:image"  image => is image name that i sent to you


</br>

## **Get Image:**
### Route:
```
/api/getImage/:image      image => is image name that you want
```
### Method:
```
POST
```
### Form Send Data:
| input name | Type |
|--------|------|
| x-auth-token | text |
### Response Data:
```
the image that have the name that is sent
```

</br>

## **Get My History:**
### Route:
```
/api/getMyHistory
```
### Method:
```
POST
```
### Form Send Data:
| input name | Type |
|--------|------|
| x-auth-token | text |
### Response Data:

- list of objects each object have:
    - id: used if i want to delete this process from my history

    - image: this is origin image name

    - resultImage: this is result image name if it is null that meanning this image isn't processed by disease detection model

    - diseases: list of the results of disease detection model if this image processed by it

    - type: this is type of plant in image if it is null this meanning that this image isn't processed by plant classification model

    - createdAt: the date of processing

- this is all process that the user do it on our app 

- I identify the user from the token

</br>

## **Delete From My History:**
### Route:
```
/api/deleteFromHistory/:id     id: id of data that the user want to delete
```
### Method:
```
PUT
```
### Form Send Data:
| input name | Type |
|--------|------|
| x-auth-token | text |
### Response Data:
```
this message "Image deleted"
```
</br> -->