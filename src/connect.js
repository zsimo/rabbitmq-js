"use strict";

var config = require("./config");
var amqp = require("amqplib");

var connectionOptions = {
    protocol: 'amqp',
    hostname: config.AMQP_HOST ,
    port: 5672,
    vhost: 'v1',
    username: config.AMQP_USERNAME,
    password: config.AMQP_PASSWORD
};

// amqp.connect(connectionOptions, function(error0, connection) {
//     if (error0) {
//         throw error0;
//     }
//
//
//     console.log(connection);
//
//
//     // connection.createChannel(function(error1, channel) {
//     //     if (error1) {
//     //         throw error1;
//     //     }
//     //
//     //     var queue = 'hello';
//     //     var msg = 'Hello World!';
//     //
//     //     channel.assertQueue(queue, {
//     //         durable: false
//     //     });
//     //     channel.sendToQueue(queue, Buffer.from(msg));
//     //
//     //     console.log(" [x] Sent %s", msg);
//     // });
//
//     // setTimeout(function() {
//     //     connection.close();
//     //     process.exit(0);
//     // }, 500);
// });


module.exports = amqp.connect(connectionOptions);