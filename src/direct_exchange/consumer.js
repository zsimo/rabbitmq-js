"use strict";


var connect = require("../connect");

var routingKey = process.argv[2] || "*";

/**
 * when the publisher post directly on queue, it post via the default exchange
 * (with the routing key equal to the queue name)
 */
(async function () {

    try {
        var connection = await connect;
        var channel = await connection.createChannel();

        var exchangeName = "simone_direct";
        await channel.assertExchange(exchangeName, "direct", {
            durable: false
        });

        var queueName = "simone_test_01";

        await channel.assertQueue(queueName, {
            durable: false
        });

        await channel.bindQueue(queueName, exchangeName, routingKey);

        console.log(" [*] Waiting for messages in %s (noAck: true). To exit press CTRL+C", queueName);
        await channel.consume(queueName, function (message) {
            console.log(`[x] Received '${message.content.toString()}' with routing key '${routingKey}'`);
         }, {
            noAck: true
        });


    } catch (error) {

        console.log(error);
    }

})();
