"use strict";


var connect = require("../connect");
var common = require("./common");
var counter = 0;
var okRoutingKey = process.argv[2] || common.ip + ".ok";

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
        await channel.assertQueue(common.ok_process_queue, {
            durable: false
        });
        // =====================================================================
        // bind exchange to queue
        // =====================================================================
        await channel.bindQueue(common.ok_process_queue, common.exchange_name, okRoutingKey);

        console.log(" [*] Waiting for messages in %s (noAck: true). To exit press CTRL+C", common.ok_process_queue);
        await channel.consume(common.ok_process_queue, function (message) {
            console.log(`successfully exec pidId#${counter++}: '${message.content.toString()}' with routing key '${okRoutingKey}'`);
        }, {
            noAck: true
        });


    } catch (error) {

        console.log(error);
    }

})();
