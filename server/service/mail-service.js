const nodemailer = require('nodemailer');

const SMTP_HOST = "***";
const SMTP_PORT = "***";
const SMTP_USER = "***";
const SMTP_PASSWORD = "***";
const API_URL = "***";
class MailService{
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD
            }
        })
    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: SMTP_USER,
            to,
            subject: `Активация аккаунта на ${API_URL}`,
            text: '',
            html:
                `<div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                 </div>`
        })
    }
}

module.exports = new MailService();
