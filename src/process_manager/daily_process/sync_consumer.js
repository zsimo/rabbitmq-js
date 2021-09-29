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

        await channel.assertQueue(common.queue_sync, common.queues_options);
        await channel.assertQueue(common.queue_response, common.queues_options);

        await channel.prefetch(1);

        console.log(" [*] Waiting for messages in %s (noAck: true). To exit press CTRL+C", common.queue_sync);
        await channel.consume(common.queue_sync, async  function (message) {
                var response = message.content.toString();
                console.log(" [x] Received %s", response);
                var result = await task(response);
                console.log(result);
                var payload = {
                    task_name: response,
                    message: result
                };
                var response = await channel.sendToQueue(common.queue_response, Buffer.from(JSON.stringify(payload)));
                console.log(response);
         }, {
            noAck: true,
            // priority: 3
        });


    } catch (error) {

        console.log(error);
    }

})();
