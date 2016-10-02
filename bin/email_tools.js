'use strict';

const amqpHandler = require('./amqp_handler.js');
const routingKey = 'emailservice';
const donationResponseHandler = amqpHandler.createMessagingHandler(routingKey);
const donationNotificationHandler = amqpHandler.createMessagingHandler(routingKey);

const senderAddress = process.env.AUTO_SENDER_ADDRESS;
const senderPass = process.env.AUTO_SENDER_PASS;

//Sends a response email to a donor
donationResponseHandler.sendResponseEmail = function(donorInfo) {
    //TODO: add donor response template
    if(donorInfo.email) {
        const emailConfig = {
            emailContent: {
                from: '"NAMI" <' + senderAddress + '>', // sender address
                to: donorInfo.email, // list of receivers
                subject: 'Thank you for your donation ' + donorInfo.first_name + ' ' + donorInfo.last_name + '!', // Subject line
                text: 'Thank you for donating $'+donorInfo.amount+'.', // plaintext body
                html: '<b>Thank you for donating $'+donorInfo.amount+'.</b>' // html body
            },
            smtpOptions: {
                auth: {
                    user: senderAddress,
                    pass: senderPass
                }
            }
        };
        donationResponseHandler.publishMessage(emailConfig);
    }
};

//Sends an email to an admin when a donation has been recieved
donationNotificationHandler.sendNotificationEmail = function(donorInfo) {
    //TODO: add donor response template
    const emailConfig = {
        emailContent: {
            from: '"NAMI" <' + senderAddress + '>', // sender address
            to: 'demetri@asu.edu', // list of receivers //TODO: add real list
            subject: donorInfo.first_name + ' ' + donorInfo.last_name + ' has sent a donation', // Subject line
            text: donorInfo.first_name + ' ' + donorInfo.last_name + ' has sent a donation of $'+donorInfo.amount, // plaintext body
            html: '<b>'+donorInfo.first_name + ' ' + donorInfo.last_name + ' has sent a donation of $'+donorInfo.amount+'</b>' // html body
        },
        smtpOptions: {
            auth: {
                user: senderAddress,
                pass: senderPass
            }
        }
    };
    donationNotificationHandler.publishMessage(emailConfig);
};

donationResponseHandler.setConsumer((msg) => {
    //TODO: add error handling for responses from email service
});

const getDonationResponseHandler = function () {
    return donationResponseHandler;
};

const getDonationNotificationHandler = function () {
    return donationNotificationHandler;
};

module.exports.getDonationResponseHandler = getDonationResponseHandler;
module.exports.getDonationNotificationHandler = getDonationNotificationHandler;
