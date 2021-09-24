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

        // =====================================================================
        // create exchange if it's not exists
        // =====================================================================
        await channel.assertExchange(common.exchange_name, 'topic', {
            durable: false
        });
        // =====================================================================
        // create queue if it's not exists
        // =====================================================================
        await channel.assertQueue(common.queue_name, {
            durable: false
        });
        // =====================================================================
        // bind exchange to queue
        // =====================================================================
        await channel.bindQueue(common.queue_name, common.exchange_name, routingKey);

        setInterval(function () {
            channel.publish(common.exchange_name, routingKey, Buffer.from(message), {
                correlationId: counter +"",
                replyTo: common.ok_process_queue
            });
            console.log(`published#${counter++}: routing key: '${routingKey}', message: '${message}'`);
        }, 1000);


    } catch (error) {

        console.log(error);
    }

})();
