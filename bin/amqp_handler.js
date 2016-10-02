'use strict';

const amqp = require('amqplib/callback_api');
const bail = require('bail');
const config = require('config');
const amqpConfig = config.get('AMPQServer');

let channel;
let running = false;
let consumerID = 0;

const start = function () {
    if (!running) {
        const amqpUrl = 'amqp://' + amqpConfig.host + ':' + amqpConfig.port;
        amqp.connect(amqpUrl, (err, conn) => {
            if (err != null) bail(err);

            conn.createChannel((err2, ch) {
                if (err2 != null) bail(err2);
                channel = ch;
                running = true;

                //Initialize exchange and queue
                ch.assertQueue(amqpConfig.queue);
                ch.assertExchange(amqpConfig.exchange);
            });
        });
    }
};

function MessagingHandler(routingKey) {
    this.id = getNextID();
    this.routingKey = routingKey;
    this.setConsumer(callback) {
        if(!channel) bail(new Error('AMQP is not connected'));

        const consumerFun = function (msg) {
            channel.ack(msg);
            callback(msg);
        };

        channel.consume(amqpConfig.queue, consumerFun, {consumerTag: this.id};
    }

    this.publishMessage(msg) {
        msg.replyTo = this.id;
        channel.publish(amqpConfig.exchange, this.routingKey, new Buffer(JSON.stringify(msg)));
    }
}

const createMessagingHandler = function () {
    return new MessagingHandler();
};

const getNextID = function () {
    return '' + consumerID++;
};

const isRunning = function () {
    return running;
};

module.exports.start = start;
module.exports.createMessagingHandler = createMessagingHandler;
module.exports.isRunning = isRunning;
