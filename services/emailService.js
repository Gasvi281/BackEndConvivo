const nodemailer = require("nodemailer");
const path= require("path")
const {nodemailerMjmlPlugin}= require ("nodemailer-mjml")

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

transporter.use('compile', nodemailerMjmlPlugin({
    templateFolder: path.join(__dirname, '../templates')
}))
const enviarMail = async(to, subject,templateData = {}) => {
    const info = await transporter.sendMail({
        from: `"Convivo" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        templateName: 'baseEmail',
        templateData
    });

    console.log("Correo enviado", info.messageId);
    return info;

};

module.exports = { enviarMail }