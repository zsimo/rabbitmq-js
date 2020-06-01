"use strict";


var connect = require("../connect");

var message = process.argv[2] || "ciao";
var counter = 0;

/**
 * when the publisher post directly on queue, it post via the default exchange
 * (with the routing key equal to the queue name)
 */
//(async function () {
    setInterval(async function () {
        try {
            var connection = await connect;
            var channel = await connection.createChannel();

            // var exchange = await channel.assertExchange("simone_direct", "direct");

            var queueName = "simone_test_01";

            await channel.assertQueue(queueName, {
                durable: false
            });

            var info = await channel.checkQueue(queueName);
            console.log("total", info);

            message = counter.toString();

            var response = await channel.sendToQueue(queueName, Buffer.from(message));

            if (response === true) {
                console.log("add message", message);
            }

        } catch (error) {

            console.log(error);
        }

        counter ++;
    }, 1000);

//})();

/** 
setTimeout(function () {
    connection.close();
    process.exit(0);
}, 500);
*/