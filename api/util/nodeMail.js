const nodemailer = require("nodemailer");
const config = require("config")
const mailConfig = config.get("mailConfig")

const sendEmail = async (to, subject, html) => {
    const transport = {
        host: mailConfig.host,
        port: mailConfig.port,
        secure: true, // use TLS
        auth: {
            user: mailConfig.user,
            pass: mailConfig.password,
        },
    }
    const mail = {
        from: mailConfig.user,
        to: to,
        subject: subject,
        html: html
    }

    const transporter = nodemailer.createTransport(transport)
    transporter.verify((error, success) => {
        if (error) {
            console.error(error)
        } else {
            console.log('Ready to send mail!')
            transporter.sendMail(mail, (err, data) => {
                if (err) {
                    console.log("fail")
                } else {
                    console.log("success")
                }
            })
        }
    })
}

module.exports = sendEmail;