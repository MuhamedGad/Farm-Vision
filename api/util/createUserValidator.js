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
        "role":{
            enum:["farmer", "engineer"]
        },
        "phoneNumber":{
            "type":"string",
            "nullable": false,
            "minLength":11
        },
        "workField":{
            "type":"string",
            "nullable": false,
        },
        "usageTarget":{
            "type":"string",
            "nullable": false,
        },
        "streetName": {
            "type": "string",
            "nullable": false
        },
        "city": {
            "type": "string",
            "nullable": false
        },
        "state": {
            "type": "string",
            "nullable": false
        },
        "country": {
            "type": "string",
            "nullable": false
        },
        "postCode": {
            "type": "string",
            "nullable": false
        }
    },
    "required":["firstName", "lastName", "email", "password", "confirmPassword", "role", "phoneNumber", "workField", "usageTarget", "streetName", "city", "state", "country", "postCode"]
}

module.exports = ajv.compile(schema)