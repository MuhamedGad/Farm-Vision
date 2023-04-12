const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "tag":{
            "type":"string",
            "minLength":3,
            "pattern":"[a-z]*"
        },
        "describtion":{
            "type":"string",
            "minLength":10
        }
    }
}
module.exports = ajv.compile(schema)