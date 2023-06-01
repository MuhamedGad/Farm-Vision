from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import insert
from sqlalchemy import text
from ultralytics import YOLO
from PIL import Image
from datetime import datetime
from werkzeug.utils import secure_filename
import tensorflow as tf
from tensorflow import keras
from keras import models, layers
import numpy as np
import cv2 
import matplotlib.pyplot as plt
import os

app = Flask(__name__)
# app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost/farmvision"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql+psycopg2://postgres:mohamed910@localhost/smart_farm"
db = SQLAlchemy(app)

def removeFile(URL):
    # Check if file exists
    if os.path.exists(URL):
        os.remove(URL)
        print("File deleted successfully")
    else:
        print("File not found")

@app.route("/api/diseaseDetection", methods=["POST"])
def diseaseDetection():
    # authentication part
    auth_token = request.headers.get('x-auth-token')
    if auth_token is None:
        return "Token is required", 401
    getTokenQuery = text('SELECT "Tokens"."token", "Tokens"."UserId" FROM public."Tokens" WHERE "Tokens"."token"=:token')
    result = db.session.execute(getTokenQuery, {"token": auth_token})
    database_token = result.mappings().all()
    if not database_token:
        return "Token is invalid", 401
    database_token = database_token[0]

    # validation part
    if "image" not in request.files:
        return "No file part", 400
    image = request.files["image"]
    if image.filename == "":
        return "No selected file", 400
    
    # save the file with a secure filename
    imagesFolderURL = "files/modelsImages/"
    now = datetime.now()
    timestamp = now.timestamp()
    milliseconds = round(timestamp * 1000)
    imagename = "image-" + str(milliseconds) + ".jpg"
    image.save(imagesFolderURL+imagename)

    # model processes
    img = Image.open(imagesFolderURL+imagename)
    img = img.resize((640, 640)) # resize to match model input size
    img.save(imagename)
    model = YOLO('models/best.pt')
    results = model.predict(stream=True, imgsz=640, source=imagename ,save=True, project=imagesFolderURL, name="", exist_ok=True)
    output= []
    for r in results:
        for c in r.boxes.cls:
            output.append(model.names[int(c)])
    removeFile(imagename)

    # Move the image from runs folder to images folder
    resultImageName = "result-"+imagename
    os.rename(imagesFolderURL+"predict/"+imagename, imagesFolderURL+resultImageName)
    os.rmdir(imagesFolderURL+"predict/")

    # unique output
    output = set(output)
    output = list(output)

    # store data in database
    insertImageDataQuery = text('INSERT INTO public."ModelsImages" ("image", "createdAt", "updatedAt", "UserId", "resultImage") VALUES (:image, :createdAt, :updatedAt, :UserId, :resultImage) RETURNING id;')
    current_date = datetime.now()
    imageData = db.session.execute(insertImageDataQuery, {
        "image":imagename,
        "createdAt":current_date,
        "updatedAt":current_date,
        "UserId": database_token["UserId"],
        "resultImage": resultImageName
    })
    imageId = imageData.fetchone()[0]
    for disease in output:
        insertDiseasesQuery = text('INSERT INTO public."DetectDiseaseResults" ("diseaseType", "createdAt", "updatedAt", "ModelsImageId") VALUES (:diseaseType, :createdAt, :updatedAt, :ModelsImageId)')
        db.session.execute(insertDiseasesQuery, {
            "diseaseType":disease,
            "createdAt":current_date,
            "updatedAt":current_date,
            "ModelsImageId": imageId
        })
    db.session.commit()

    # send response
    if len(output) >=1 :
        response = {"diseases":output, "image":imagename, "resultImage":resultImageName}
        return jsonify(response)
    else :
        response = {"diseases": 'Healthy Plant', "image":imagename, "resultImage":resultImageName}
        return jsonify(response)


@app.route("/api/plantClassification", methods=["POST"])
def plantClassification():
    # authentication part
    auth_token = request.headers.get('x-auth-token')
    if auth_token is None:
        return "Token is required", 401
    getTokenQuery = text('SELECT "Tokens"."token", "Tokens"."UserId" FROM public."Tokens" WHERE "Tokens"."token"=:token')
    result = db.session.execute(getTokenQuery, {"token": auth_token})
    database_token = result.mappings().all()
    if not database_token:
        return "Token is invalid", 401
    database_token = database_token[0]

    # validation part
    if "image" not in request.files:
        return "No file part", 400
    image = request.files["image"]
    if image.filename == "":
        return "No selected file", 400
    
    # save the file with a secure filename
    imagesFolderURL = "files/modelsImages/"
    now = datetime.now()
    timestamp = now.timestamp()
    milliseconds = round(timestamp * 1000)
    imagename = "image-" + str(milliseconds) + ".jpg"
    image.save(imagesFolderURL+imagename)

    img = cv2.imread(imagesFolderURL+imagename)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cv2.imwrite(imagename, gray)

    test = []
    img = cv2.imread(imagename)
    resized_img = cv2.resize(img, (256,256))
    test.append(resized_img)
    test = np.array(test)
    test_scaled = test / 255

    # model processes
    class_namesAll = ['Maize', 'Strawberry', 'Wheat']
    modelAll = keras.models.load_model('models/3PlantFinal.h5')
    y_pred = modelAll.predict(test_scaled)
    class_name = class_namesAll[np.argmax(y_pred)]
    removeFile(imagename)

    # store data in database
    insertImageDataQuery = text('INSERT INTO public."ModelsImages" ("image", "createdAt", "updatedAt", "UserId", "type") VALUES (:image, :createdAt, :updatedAt, :UserId, :type) RETURNING id;')
    current_date = datetime.now()
    imageData = db.session.execute(insertImageDataQuery, {
        "image":imagename,
        "createdAt":current_date,
        "updatedAt":current_date,
        "UserId": database_token["UserId"],
        "type": class_name
    })
    db.session.commit()

    # send response
    response = {"result": class_name, "image": imagename}
    return jsonify(response)

@app.route("/api/getImage/<image>", methods=["GET"])
def getImage(image):
    # authentication part
    auth_token = request.headers.get('x-auth-token')
    if auth_token is None:
        return "Token is required", 401
    getTokenQuery = text('SELECT "Tokens"."token", "Tokens"."UserId" FROM public."Tokens" WHERE "Tokens"."token"=:token')
    result = db.session.execute(getTokenQuery, {"token": auth_token})
    database_token = result.mappings().all()
    if not database_token:
        return "Token is invalid", 401
    database_token = database_token[0]

    # url = "images/detectDiseasesResults/"
    imagesFolderURL = "files/modelsImages/"
    if os.path.exists(imagesFolderURL+image):
        return send_from_directory(imagesFolderURL, image)
    else:
        return "File not found", 400
