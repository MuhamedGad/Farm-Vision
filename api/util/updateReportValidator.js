const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "title":{
            "type":"string",
            "minLength":5,
            "maxLength":30
        },
        "describtion":{
            "type":"string",
            "minLength":10,
            "maxLength":1000
        },
        "type":{
            enum:["feedback", "error", "suggestion", "other"],
        }
    }
}
module.exports = ajv.compile(schema)