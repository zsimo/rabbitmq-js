"use strict";


var connect = require("../../connect");
var common = require("./common");

var completed_tasks = [];

(async function () {

    try {
        var connection = await connect;
        var channel = await connection.createChannel();
        // var exchange = await channel.assertExchange("simone_direct", "direct");

        await channel.assertQueue(common.queue_sync, {
            durable: false
        });
        await channel.assertQueue(common.queue_async, {
            durable: false
        });
        await channel.assertQueue(common.queue_response, {
            durable: false
        });


        // correlationId: counter +"",
        //     replyTo: common.ok_process_queue
        var message = "task01";
        var response = await channel.sendToQueue(common.queue_sync, Buffer.from(message));
        if (response === true) {
            console.log("add message", message);
        }


        await channel.consume(common.queue_response, async  function (message) {
            var response = message.content.toString();
            completed_tasks.push(response);

            console.log(response);
            channel.ack(message);

            switch (response) {
                case "task01":
                    await channel.sendToQueue(common.queue_sync, Buffer.from("task02"));
                    return;
                case "task02":
                    await channel.sendToQueue(common.queue_sync, Buffer.from("task03"));
                    return;
                case "task03":
                    await channel.sendToQueue(common.queue_async, Buffer.from("task04"));
                    await channel.sendToQueue(common.queue_async, Buffer.from("task05"));
                    await channel.sendToQueue(common.queue_async, Buffer.from("task06"));
                    return;
                case "task07":
                    console.log("complete")
                    await channel.close();
                    process.exit(0);
                    return;
                default:
                    if (completed_tasks.indexOf("task04") !== -1 && completed_tasks.indexOf("task05") !== -1 && completed_tasks.indexOf("task06") !== -1) {
                        await channel.sendToQueue(common.queue_sync, Buffer.from("task07"));
                    }
                    return;
            }

        }, {
            noAck: false
        });



    } catch (error) {

        console.log(error);
    }

})();
