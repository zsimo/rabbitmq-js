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

        var exchangeName = "simone_fanout";
        await channel.assertExchange(exchangeName, 'fanout', {
            durable: false
        });

        var routingKey = "";
        channel.publish(exchangeName, routingKey, Buffer.from(message));

        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);


    } catch (error) {

        console.log(error);
    }

})();
