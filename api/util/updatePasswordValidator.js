const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "oldPassword":{
            "type":"string",
            "minLength":8
        },
        "password":{
            "type":"string",
            "minLength":8
        },
        "confirmPassword":{
            "type":"string",
            "minLength":8
        }
    },
    "required":["oldPassword", "password", "confirmPassword"]
}

module.exports = ajv.compile(schema)