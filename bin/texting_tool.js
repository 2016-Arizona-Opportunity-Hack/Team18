'use strict';

const amqpHandler = require('./amqp_handler.js');
const routingKey = 'textingservice';

const donationTextingHandler = amqpHandler.createMessagingHandler(routingKey);

const senderAddress = process.env.AUTO_TEXTER_SID;
const senderPass = process.env.AUTO_TEXTER_TOKEN;

//Sends a response text to a donor
donationTextingHandler.sendResponseText = function(donorInfo) {
    //TODO: add donor response template
    if(donorInfo.email) {
        const textConfig = {
            textContent: {
                from: process.env.AUTO_TEXTER_NUMBER,
                to: donorInfo.phone,
                message: donorInfo.message
            },
            smsOptions: {
                auth: {
                    user: senderAddress,
                    pass: senderPass
                }
            }
        };
        donationTextingHandler.publishMessage(emailConfig);
    }
};

donationTextingHandler.setConsumer((msg) => {
    //TODO: add error handling for responses from email service
});

const getDonationTextingHandler = function () {
    return donationTextingHandler;
};

module.exports.getDonationTextingHandler = getDonationTextingHandler;
