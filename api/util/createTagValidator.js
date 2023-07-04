const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "tag":{
            "type":"string",
            "minLength":3
        },
        "describtion":{
            "type":"string",
            "minLength":10
        }
    },
    "required":["tag", "describtion"]
}
module.exports = ajv.compile(schema)