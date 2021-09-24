"use strict";


var connect = require("../connect");
var common = require("./common");

var routingKey = process.argv[2] || common.ip + ".process_name";
var okRoutingKey = process.argv[2] || common.ip + ".ok";
var counter = 0;

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

        // =====================================================================
        // create ok queue if it's not exists
        // =====================================================================
        await channel.assertQueue(common.ok_process_queue, {
            durable: false
        });
        // =====================================================================
        // bind exchange to ok queue
        // =====================================================================
        await channel.bindQueue(common.ok_process_queue, common.exchange_name, okRoutingKey);

        console.log(" [*] Waiting for messages in %s (noAck: true). To exit press CTRL+C", common.queue_name);
        await channel.consume(common.queue_name, function (message) {
            console.log(`exec command#${counter++} '${message.content.toString()}' with routing key '${routingKey}'`);

            console.log(message.properties)
            setTimeout(async function () {

                var pidId = "1";
                await channel.publish(common.exchange_name, okRoutingKey, Buffer.from(pidId));
                channel.ack(message);
                // channel.nack(message);
            }, 1000);
        }, {
            noAck: false
        });


    } catch (error) {

        console.log(error);
    }

})();


// exchange: process_manager (consumer)
// routes: 123.43.32.22/process_name
// 123.43.32.22/project_name
// 123.43.32.21/task
// 123.43.32.21/*
// 		123.43.32.21/process_ended/<pid>
