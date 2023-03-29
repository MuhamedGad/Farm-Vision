const jimp = require("jimp")
const tf = require('@tensorflow/tfjs-node');
const labels = require("../public/insectsAIModel/labels")
const modelURL = "http://localhost:8888/insectsAIModel/model.json"
const imgWidth = 256;
const imgHeight = 256;
const imgChannels = 3;

const getImage = async(url)=>{
	let data = [],
		row = [],
		imgData = []
	try{
		const image = await jimp.read(url)
		await image.resize(imgWidth, imgHeight).scan(0, 0, imgWidth, imgHeight, (x, y, idx) => {
			data.push([image.bitmap.data[idx + 0]/255, image.bitmap.data[idx + 1]/255, image.bitmap.data[idx + 2]/255])
		})
	}catch(err){
		console.error(err)
	}
	for (let i = 0; i < data.length; i=i+imgWidth) {
		row = []
		for (let j = 0; j < imgWidth; j++) {
			row.push(data[i+j])
		}
		imgData.push(row)
	}
	return imgData
}

const predict = (model, imgData)=>{
	const imageTensor = tf.tensor(imgData, [imgWidth, imgHeight, imgChannels]);
	const inputTensor = imageTensor.expandDims();
	const prediction = model.predict(inputTensor);
	const scores = prediction.arraySync()[0];
	const maxScore = prediction.max().arraySync();
	const maxScoreIndex = scores.indexOf(maxScore);

	const labelScores = {};
	scores.forEach((s, i) => {
		labelScores[labels[i]] = parseFloat(s.toFixed(4));
	});

	return {
		prediction: `${labels[maxScoreIndex]} (${parseInt(maxScore * 100)}%)`,
		scores: labelScores
	}
}

const runInsectsModel = async(req, res)=>{
    let token = req.header("x-auth-token")

    if(!req.file) {
        if(token) return res.status(403).json({
            message: "No File Uploaded :(",
            token
        })
        else return res.status(403).json({
            message: "No File Uploaded :("
        })
    }

    const imgPath = "http://localhost:8888/images/"+req.file.filename
    try{
        const imgData = await getImage(imgPath, imgWidth, imgHeight)
        tf.loadLayersModel(modelURL).then(async(model) => {
            return res.status(200).json(predict(model, imgData, labels, imgWidth, imgHeight, imgChannels))
        }).catch((err)=>{
            if(token) return res.status(500).json({
                message: "Tensorflow Error: " + err,
                token
            })
            else return res.status(500).json({
                message: "Tensorflow Error: " + err
            })
        })
    }catch(err){
        if(token) return res.status(500).json({
            message: "Read Image Error: " + err,
            token
        })
        else return res.status(500).json({
            message: "Read Image Error: " + err
        })
    }
}

module.exports = {
    runInsectsModel
}