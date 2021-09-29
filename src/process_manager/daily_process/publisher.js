"use strict";


var connect = require("../../connect");
var common = require("./common");

var completed_tasks = [];

(async function () {

    try {
        var connection = await connect;
        var channel = await connection.createChannel();

        await channel.assertQueue(common.queue_sync, common.queues_options);
        await channel.assertQueue(common.queue_async, common.queues_options);
        await channel.assertQueue(common.queue_response, common.queues_options);


        var info = await channel.checkQueue((common.queue_sync));
        console.log("queue status", info);

        var task01 = "task01";
        var sendToQueueResponse = await channel.sendToQueue(common.queue_sync, Buffer.from(task01));
        if (sendToQueueResponse === true) {
            console.log(`${task01} add to queue ${common.queue_sync}`);
        }

        await channel.consume(common.queue_response, async  function (message) {
            var response = JSON.parse(message.content.toString());
            var taskName = response.task_name;
            completed_tasks.push(taskName);

            console.log(response.message);

            channel.ack(message);

            switch (taskName) {
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
