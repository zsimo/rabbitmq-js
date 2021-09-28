"use strict";

var common = require("./common");
var connect = require("../../connect");
var task = require("./task");
/**
 * when the publisher post directly on queue, it post via the default exchange
 * (with the routing key equal to the queue name)
 */
(async function () {

    try {
        var connection = await connect;
        var channel = await connection.createChannel();

        await channel.assertQueue(common.queue_sync, {
            durable: false
        });
        await channel.assertQueue(common.queue_response, {
            durable: false
        });

        await channel.prefetch(1);

        console.log(" [*] Waiting for messages in %s (noAck: true). To exit press CTRL+C", common.queue_sync);
        await channel.consume(common.queue_sync, async  function (message) {
                var response = message.content.toString();
                console.log(" [x] Received %s", response);
                var result = await task(response);
                console.log(result);
                // channel.ack(message);
                var response = await channel.sendToQueue(common.queue_response, Buffer.from(response));
                console.log(response);
         }, {
            noAck: true,
            // priority: 3
        });


    } catch (error) {

        console.log(error);
    }

})();
