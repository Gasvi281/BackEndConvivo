const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

const enviarMail = async(to, subject, text, html) => {
    const info = await transporter.sendMail({
        from: `"Convivo" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });

    console.log("Correo enviado", info.messageId);
    return info;

};

module.exports = { enviarMail }