#!/usr/bin/env node

"use strict";


var connect = require("../connect");
var common = require("./common");
var counter = 0;

var routingKey = process.argv[2] || common.ip + ".process_name";
var message = process.argv[3] || "pwd";

/**
 * when the publisher post directly on queue, it post via the default exchange
 * (with the routing key equal to the queue name)
 */
(async function () {

    try {
        var connection = await connect;
        var channel = await connection.createChannel();

        await channel.assertExchange(common.exchange_name, 'topic', {
            durable: false
        });

        setInterval(function () {
            channel.publish(common.exchange_name, routingKey, Buffer.from(message));
            console.log(`published#${counter++}: routing key: '${routingKey}', message: '${message}'`);
        }, 1000);


    } catch (error) {

        console.log(error);
    }

})();
