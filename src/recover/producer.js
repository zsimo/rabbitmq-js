"use strict";

var connect = require("../connect");
var config = require("./config");
var counter = 0;

var msg;




setInterval(async function () {
    try {

        var connection = await connect;
        var channel = await connection.createChannel();

        msg = counter.toString();

        channel.assertQueue(config.queue, {
            durable: true
        });

        var info = await channel.checkQueue(config.queue);
        console.log("total", info);

        channel.sendToQueue(config.queue, Buffer.from(msg), {
            persistent: true
        });
        console.log(" [x] Sent '%s'", msg);

    } catch (error) {

        console.log(error);
    }

    counter ++;
}, 1000);