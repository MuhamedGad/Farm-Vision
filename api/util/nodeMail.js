const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text, link) => {
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',   // in real come from process.env.HOST
        // service: process.env.SERVICE,
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,      // in real come from process.env.USER
            pass: testAccount.pass,      // in real come from process.env.PASS
        },
    })
    
    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: testAccount.user,    // in real come from process.env.USER
            to: email,
            subject: subject,
            text: text,
            html: "<a href='" + link + "'>Please Click Here To Verify<a>"
        })
        console.log("email sent sucessfully")

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou..
    } catch (error) {
        console.log("email not sent")
        console.log(error)
    }
};

module.exports = sendEmail;