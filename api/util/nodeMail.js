const nodemailer = require("nodemailer");
const config = require("config")
const mailConfig = config.get("mailConfig")

const sendEmail = async (to, subject, message, link = {url:"",describtion:""}) => {
    const transport = {
        host: mailConfig.host,
        port: mailConfig.port,
        secure: true, // use TLS
        auth: {
            user: mailConfig.user,
            pass: mailConfig.password
        },
    }
    const mail = {
        from: mailConfig.user,
        to: to,
        subject: subject,
        html: `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Farm Vision Email</title>
                    <style>
                        body{
                            text-align: center;
                            color: #333;
                            padding: 3% 30%;
                            font-size: large;
                        }
                        #link{
                            background-color: #333;
                            color: #ddd;
                            padding: 10px;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <h1>${subject}</h1>
                    <p>${message}</p>
                    <a id="link" href="${link.url}">${link.describtion}</a>
                    <p> Have any questions so far? Visit <a href="#">Farm Vision Support</a> or <a href="#">Contact Us</a>.</p>
                    <p>Thanks,</p>
                    <p>Farm Vision</p>
                </body>
            </html>
        `
    }

    const transporter = nodemailer.createTransport(transport)
    transporter.verify((error, success) => {
        if (error) {
            console.error(error)
        } else {
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