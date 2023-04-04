# !pip install ultralytics
from IPython import display
import ultralytics

from ultralytics import YOLO
from PIL import Image

img = Image.open('1.jpg')
img = img.resize((640, 640)) # resize to match model input size
img.save('readyImg.jpg')

model = YOLO('best.pt')
results = model.predict(stream=True, imgsz=640, source='readyImg.jpg' ,save=True) # source already setup
output= []
for r in results:
    for c in r.boxes.cls:
        output.append(model.names[int(c)])


        
if len(output) >=1 :
    print (output)
else :
    print ('Healthy Plant')
    
    
import matplotlib.pyplot as plt
outputImg = Image.open('runs/segment/predict/readyImg.jpg')
outputImg.show()