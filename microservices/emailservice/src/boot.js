'use strict';

const amqp = require('amqplib/callback_api');
const bail = require('bail');
const config = require('config');
const amqpConfig = config.get('AMPQServer');
const emailSender = require('./handlers/emailsender.js');

const start = function () {
    amqp.connect('amqp://' + amqpConfig.host + ':' + amqpConfig.port, (err, conn) => {
        if (err != null) bail(err);

        const startConsumingFromQueue = function () {
            const onOpen = function (err2, ch) {
                if (err2 != null) bail(err2);
                ch.assertQueue(amqpConfig.queue);
                ch.consume(amqpConfig.queue, (msg) => {
                    const msgContents = JSON.parse(msg.content.toString());
                    try {
                        emailSender.sendEmail(msgContents, (err3, response) => {
                            if (err3 != null) {
                                ch.ack(msg);
                                publishToExchange(msg.replyTo, err3)
                            }
                            else {
                                ch.ack(msg);
                                publishToExchange(msg.replyTo, response);
                            }
                        });
                    }
                    catch (e) {
                        ch.ack(msg);
                        publishToExchange(msg.replyTo, e);
                    }
                });
                console.log('listening for messages on ' + amqpConfig.queue + ' queue');
            };
            conn.createChannel(onOpen);
        };

        const publishToExchange = function (routingKey, msg) {
            conn.createChannel((err2, ch) => {
                if (err2 != null) bail(err2);
                ch.assertExchange(amqpConfig.exchange);
                ch.publish(amqpConfig.exchange, routingKey, new Buffer(JSON.stringify(msg)));
            });
        };

        startConsumingFromQueue();
        console.log('connected to amqp server');
    });
};

module.exports.start = start;
