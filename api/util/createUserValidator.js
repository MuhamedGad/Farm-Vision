const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "firstName":{
            "type":"string",
            "nullable": false,
        },
        "lastName":{
            "type":"string",
            "nullable": false,
        },
        "email":{
            "type":"string",
            "pattern":".+\@.+\..+"
        },
        "password":{
            "type":"string",
            "minLength":8
        },
        "confirmPassword":{
            "type":"string",
            "minLength":8
        },
        "address":{
            "type":"string",
            "nullable": false
        },
        "phoneNumber":{
            "type":"string",
            "nullable": false,
        }
    },
    "required":["firstName", "lastName", "email", "password", "confirmPassword", "address", "phoneNumber"]
}

module.exports = ajv.compile(schema)