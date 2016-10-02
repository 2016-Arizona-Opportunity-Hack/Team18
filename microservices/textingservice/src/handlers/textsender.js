const twilio = require('twilio');
const config = require('config');

const textingServerConfig = config.get('TextingServer');

const client = twilio(process.env.SID, process.env.TOKEN);

const sendText = function (textingJson, callback) {
    client.sendMessage({
        to: textingJson.recipient,
        from: textingJson.sender,
        body: textingJson.message
    }, callback);
};

module.exports.sendText = sendText;
