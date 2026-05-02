const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const cargarTemplate = (nombreTemplate, datos) => {
    const rutaTemplate = path.join(__dirname, '../templates', `${nombreTemplate}.html`);
    let html = fs.readFileSync(rutaTemplate, 'utf8');
    Object.entries(datos).forEach(([key, value]) => {
        html = html.replaceAll(`{{${key}}}`, value);
    });
    return html;
};

const enviarMail = async (to, subject, templateData = {}) => {
    const html = cargarTemplate('baseEmail', templateData);
    const info = await transporter.sendMail({
        from: `"Convivo" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
    console.log("Correo enviado", info.messageId);
    return info;
};

const enviarMailConfirm = async (to, subject, templateData = {}) => {
    const html = cargarTemplate('confirmEmail', templateData);
    const info = await transporter.sendMail({
        from: `"Convivo" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
    console.log("Correo enviado", info.messageId);
    return info;
};

module.exports = { enviarMail, enviarMailConfirm };