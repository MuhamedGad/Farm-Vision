# Plant Classification Model

This model is for classifying plants into three classes: Maize, Strawberry, and Wheat. It is based on a convolutional neural network (CNN) that was trained on images from different sources.

## How to use

To use this model, you need to download the following files from this folder:

- test.ipynb: This is a Jupyter notebook that contains the code for loading and testing the model on new images. You can run it on Google Colab or your local machine.
- plant_model.h5: This is the saved model file that contains the weights and architecture of the CNN. You need to upload it to your Google Drive or your local machine.
- model.ipynb: This is another Jupyter notebook that contains the code for creating and training the model. You can run it if you want to see how the model was built and trained.

## Data sources

The model was trained on images from the following sources:

- Wheat: https://universe.roboflow.com/tannu-goyal-qynbd/v-cs3jb/browse?queryText=&pageSize=50&startingIndex=0&browseQuery=true
- Strawberry: https://universe.roboflow.com/doan-keskin/strawberry-igbeg/browse?queryText=split%3Atest&pageSize=50&startingIndex=0&browseQuery=true
- Maize: https://universe.roboflow.com/pornsinee/pro-kfccs

The images were resized to 224x224 pixels and augmented with random rotations, flips, and crops.

## Results

The model achieved an accuracy of 95% on the test set, which consisted of 60 images (20 for each class)
