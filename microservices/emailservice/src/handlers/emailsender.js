const nodemailer = require('nodemailer');
const config = require('config');

const emailServerConfig = config.get('EmailServer');

const sendEmail = function (emailJson, callback) {
    const smtpOptions = {
        service: 'zoho',
        auth: emailJson.smtpOptions.auth
    };
    const transporter = nodemailer.createTransport(smtpOptions);
    transporter.sendMail(emailJson.emailContent, callback);
};

module.exports.sendEmail = sendEmail;
