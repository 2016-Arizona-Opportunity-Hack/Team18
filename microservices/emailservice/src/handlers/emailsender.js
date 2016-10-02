const nodemailer = require('nodemailer');
const config = require('config');

const emailServerConfig = config.get('EmailServer');

const sendEmail = function (emailJson, callback) {
    const transporter = nodemailer.createTransport(
        'smtps://' +
        encodeURI(emailJson.from.address) + ':' +
        encodeURI(emailJson.from.password) + '@' +
        emailServerConfig.host + ':' +
        emailServerConfig.port
    );

    transporter.sendMail(emailJson, callback);
};

modules.exports.sendEmail = sendEmail;
