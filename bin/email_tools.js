'use strict';

const amqpHandler = require('./amqp_handler.js');

const routingKey = 'emailservice';
const donationResponseHandler = amqpHandler.createMessagingHandler(routingKey);

donationResponseHandler.setConsumer((msg) => {
    //TODO: add error handling
});

const getDonationResponseHandler = function () {
    return donationResponseHandler;
};
