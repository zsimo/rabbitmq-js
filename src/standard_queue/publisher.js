"use strict";


var connect = require("../connect");

var message = process.argv[2] || "ciao";

/**
 * when the publisher post directly on queue, it post via the default exchange
 * (with the routing key equal to the queue name)
 */
(async function () {

    try {
        var connection = await connect;
        var channel = await connection.createChannel();

        // var exchange = await channel.assertExchange("simone_direct", "direct");

        var queueName = "simone_test_01";

        await channel.assertQueue(queueName, {
            durable: false
        });

        await channel.sendToQueue(queueName, Buffer.from(message));

        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);


    } catch (error) {

        console.log(error);
    }

})();
