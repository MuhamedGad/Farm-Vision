const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "content":{
            "type":"string",
            "minLength":10,
            "maxLength":1000
        }
    },
    "required":["content"]
}
module.exports = ajv.compile(schema)