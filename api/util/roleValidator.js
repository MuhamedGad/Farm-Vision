const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    "type": "object",
    "properties": {
        "role":{
            enum:["farmer", "engineer", "admin", "superAdmin"]
        }
    },
    "required":["role"]
}
module.exports = ajv.compile(schema)