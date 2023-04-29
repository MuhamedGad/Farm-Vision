const nodemailer = require("nodemailer");

const sendEmail = async (from, to, subject, text, link) => {
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,   // in real come from process.env.HOST
        // service: process.env.SERVICE,
        port: 587,
        secure: false,
        auth: {
            user: from,      // in real come from process.env.USER
            pass: "mohamed910",      // in real come from process.env.PASS
        },
    })
    
    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: from,    // in real come from process.env.USER
            to: to,
            subject: subject,
            text: text,
            html: "<a href='" + link + "'>Please Click Here To Verify<a>"
        })
        console.log("email sent sucessfully")

        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou..
    } catch (error) {
        console.log("email not sent")
        console.log(error)
    }
};

module.exports = sendEmail;