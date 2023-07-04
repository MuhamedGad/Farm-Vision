const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "firstName":{
            "type":"string",
            "nullable": false,
            "maxLength": 255
        },
        "lastName":{
            "type":"string",
            "nullable": false,
            "maxLength": 255
        },
        "userName":{
            "type":"string",
            "nullable": false,
            "pattern":"^[a-z][a-z0-9]*$",
            "maxLength": 255
        },
        "email":{
            "type":"string",
            "pattern":".+\@.+\..+",
            "maxLength": 255
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
            enum:["farmer", "engineer", "admin", "superAdmin"]
        },
        "phoneNumber":{
            "type":"string",
            "nullable": false,
            "maxLength": 255
        },
        "workField":{
            "type":"string",
            "nullable": false,
            "maxLength": 255
        },
        "usageTarget":{
            "type":"string",
            "nullable": false,
            "maxLength": 255
        },
        "streetName": {
            "type": "string",
            "nullable": false,
            "maxLength": 255
        },
        "city": {
            "type": "string",
            "nullable": false,
            "maxLength": 255
        },
        "state": {
            "type": "string",
            "nullable": false,
            "maxLength": 255
        },
        "country": {
            "type": "string",
            "nullable": false,
            "maxLength": 255
        },
        "postCode": {
            "type": "string",
            "nullable": false,
            "maxLength": 255
        }
    },
    "required":["userName", "email", "password", "confirmPassword", "role", "phoneNumber", "country"]
}

module.exports = ajv.compile(schema)