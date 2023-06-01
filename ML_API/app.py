from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import insert
from sqlalchemy import text
from ultralytics import YOLO
from PIL import Image
from datetime import datetime
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost/farmvision"
db = SQLAlchemy(app)

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
# app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql+psycopg2://username:password@localhost/database_name"

def removeFile(URL):
    # Check if file exists
    if os.path.exists(URL):
        os.remove(URL)
        print("File deleted successfully")
    else:
        print("File not found")


@app.route("/", methods=["POST"])
def detectDisease():
    # authentication part
    auth_token = request.headers.get('x-auth-token')
    if auth_token is None:
        return "Token is required", 401
    getTokenQuery = text("SELECT token, UserId FROM tokens WHERE token=:token")
    result = db.session.execute(getTokenQuery, {"token": auth_token})
    database_token = result.mappings().all()[0]
    if database_token is None:
        return "Token is invalid", 401

    # validation part
    if "image" not in request.files:
        return "No file part", 400
    image = request.files["image"]
    if image.filename == "":
        return "No selected file", 400
    
    # save the file with a secure filename
    now = datetime.now()
    timestamp = now.timestamp()
    milliseconds = round(timestamp * 1000)
    imagename = "image-" + str(milliseconds) + ".jpg"
    imageURLBeforePredict = "images/modelsImages/"+imagename
    image.save(imageURLBeforePredict)

    img = Image.open(imageURLBeforePredict)
    img = img.resize((640, 640)) # resize to match model input size
    img.save(imagename)

    model = YOLO('models/best.pt')
    results = model.predict(stream=True, imgsz=640, source=imagename ,save=True, project="images/detectDiseasesResults", name="", exist_ok=True)
    
    output= []
    for r in results:
        for c in r.boxes.cls:
            output.append(model.names[int(c)])

    removeFile(imagename)

    # Move the image from runs folder to images folder
    os.rename("images/detectDiseasesResults/predict/"+imagename, "images/detectDiseasesResults/"+imagename)
    os.rmdir("images/detectDiseasesResults/predict")

    output = set(output)
    output = list(output)

    insertImageDataQuery = text("INSERT INTO modelsimages (image, createdAt, updatedAt, UserId) VALUES (:image, :createdAt, :updatedAt, :UserId)")
    current_date = datetime.now()
    # with db.session.begin():
    imageData = db.session.execute(insertImageDataQuery, {
        "image":imagename,
        "createdAt":current_date,
        "updatedAt":current_date,
        "UserId": database_token["UserId"]
    })
    
    for disease in output:
        insertDiseasesQuery = text("INSERT INTO detectdiseaseresults (diseaseType, createdAt, updatedAt, ModelsImageId) VALUES (:diseaseType, :createdAt, :updatedAt, :ModelsImageId)")
        db.session.execute(insertDiseasesQuery, {
            "diseaseType":disease,
            "createdAt":current_date,
            "updatedAt":current_date,
            "ModelsImageId": imageData.lastrowid
        })
    db.session.commit()

    if len(output) >=1 :
        response = {"result":output, "image":imagename}
        return jsonify(response)
    else :
        response = {"result": 'Healthy Plant'}
        return jsonify(response)


@app.route("/<image>", methods=["GET"])
def getPlantDisease_endpoint(image):
    # authentication part
    auth_token = request.headers.get('x-auth-token')
    if auth_token is None:
        return "Token is required", 401
    getTokenQuery = text("SELECT token, UserId FROM tokens WHERE token=:token")
    result = db.session.execute(getTokenQuery, {"token": auth_token})
    database_token = result.mappings().all()[0]
    if database_token is None:
        return "Token is invalid", 401

    url = "images/detectDiseasesResults/"
    if os.path.exists(url+image):
        return send_from_directory(url, image)
    else:
        return "File not found", 400