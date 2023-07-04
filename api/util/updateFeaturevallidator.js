const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "feature":{
            "type":"string",
            "minLength":3,
            "maxLength": 255
        },
        "describtion":{
            "type":"string",
            "minLength":10,
            "maxLength": 255
        },
        "price":{
            "type":"string",
            "maxLength": 255
        },
    }
}
module.exports = ajv.compile(schema)