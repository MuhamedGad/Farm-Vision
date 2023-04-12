const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "feature":{
            "type":"string",
            "minLength":3,
            "pattern":"[a-z]*"
        },
        "describtion":{
            "type":"string",
            "minLength":10
        },
        "price":{
            "type":"string"
        },
    }
}
module.exports = ajv.compile(schema)