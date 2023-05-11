const nodemailer = require("nodemailer");
const config = require("config")
const ourEmail = config.get("ourEmail")

const sendEmail = async (to, subject, html) => {
    const transport = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use TLS
        auth: {
            user: ourEmail,
            pass: "ztajaxxwlixtzgay",
        },
    }
    const mail = {
        from: ourEmail,
        to: to,
        subject: subject,
        html: html
    }

    const transporter = nodemailer.createTransport(transport)
    transporter.verify((error, success) => {
        if (error) {
            //if error happened code ends here
            console.error(error)
        } else {
            //this means success
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