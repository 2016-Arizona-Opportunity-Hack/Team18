'use strict';

const amqp = require('amqplib/callback_api');
const config = require('config');
const amqpConfig = config.get('AMPQServer');
const emailSender = require('./handlers/emailsender.js');

const start = function () {
    amqp.connect('amqp://' + amqpConfig.host + ':' + amqpConfig.port, (err, conn) => {
        if (err != null) bail(err);

        const startConsumingFromQueue = function () {
            conn.createChannel(on_open);

            const on_open = function (err2, ch) {
                conn.consume(amqpConfig.queue, (msg) => {
                    if (err2 != null) {
                        callback(err2, null);
                    }
                    else {
                        const msgContents = msg.content.toJSON();
                        emailSender.sendEmail(msgContents, (err3, response) => {
                            publishToExchange(routingKey, response);
                        });
                    }
                });

                console.log('listening for messages on ' + amqpConfig.queue + ' queue');
            };
        };

        const publishToExchange = function (routingKey, msg) {
            conn.createChannel((err2, ch) => {
                if (err2 != null) bail(err2);
                ch.assertExchange(amqpConfig.exchange);
                ch.publish(amqpConfig.queue);
            });
        };

        console.log('connected to amqp server');
    });
};

module.exports.start = start;
