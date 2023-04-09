const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "password":{
            "type":"string",
            "minLength":8
        },
        "confirmPassword":{
            "type":"string",
            "minLength":8
        }
    },
    "required":["password", "confirmPassword"]
}

module.exports = ajv.compile(schema)