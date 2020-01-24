#!/usr/bin/env node

"use strict";


var connect = require("../connect");


var message = process.argv[2] || "ciao";
var routingKey = process.argv[3] || "*";

/**
 * when the publisher post directly on queue, it post via the default exchange
 * (with the routing key equal to the queue name)
 */
(async function () {

    try {
        var connection = await connect;
        var channel = await connection.createChannel();

        var exchangeName = "simone_topic";
        await channel.assertExchange(exchangeName, 'topic', {
            durable: false
        });

        channel.publish(exchangeName, routingKey, Buffer.from(message));

        console.log(`published: routing key: '${routingKey}', message: '${message}'`);

        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);


    } catch (error) {

        console.log(error);
    }

})();
