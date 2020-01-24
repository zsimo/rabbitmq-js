"use strict";


var connect = require("../connect");

/**
 * when the publisher post directly on queue, it post via the default exchange
 * (with the routing key equal to the queue name)
 */
(async function () {

    try {
        var connection = await connect;
        var channel = await connection.createChannel();

        var exchangeName = "simone_fanout";
        await channel.assertExchange("simone_fanout", "fanout", {
            durable: false
        });

        var queueName = "simone_test_01";

        var queue = await channel.assertQueue(queueName, {
            durable: false
        });

        await channel.bindQueue(queue.q, exchangeName, '');

        console.log(" [*] Waiting for messages in %s (noAck: true). To exit press CTRL+C", queueName);
        await channel.consume(queue.q, function (message) {
             console.log(" [x] Received %s", message.content.toString());
         }, {
            noAck: true
        });


    } catch (error) {

        console.log(error);
    }

})();
