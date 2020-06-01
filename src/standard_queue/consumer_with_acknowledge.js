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

        var queueName = "simone_test_01";

        await channel.assertQueue(queueName, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s (noAck: false). To exit press CTRL+C", queueName);

        await channel.consume(queueName, function (message) {
            console.log(" [x] Received %s", message.content.toString());
            
            console.log("ack done");
            channel.ack(message);

        }, {
            noAck: false
        });


    } catch (error) {

        console.log(error);
    }

})();
