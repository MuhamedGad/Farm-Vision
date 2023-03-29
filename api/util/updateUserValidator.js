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
        "address":{
            "type":"string",
            "nullable": false,
        },
        "phoneNumber":{
            "type":"string",
            "nullable": false,
        }
    }
}

module.exports = ajv.compile(schema)