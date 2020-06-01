"use strict";

var connect = require("../connect");
var config = require("./config");
var fs = require("fs");
var connection;
var channel;
var error = false;
var timeoutId;
const RETRY_TIMEOUT = 5000;

(async function () {

    try {
        connection = await connect;
        channel = await connection.createChannel();
        
        // This makes sure the queue is declared before attempting to consume from it
        channel.assertQueue(config.queue, {
          durable: true
        });
        
        channel.consume(config.queue, function(msg) {

            if (error === true) {
                return;
            }
          
            try {
                console.log(" [x] Received %s", msg.content.toString());
                fs.readFileSync("./test.txt");
                console.log(" [x] Done", msg.content.toString());
                channel.ack(msg);

                error = false;
                clearTimeout(timeoutId);

            } catch (e) {
                console.error(e);
                error = true;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                    error = false;
                    console.log("try to recover");
                    channel.recover(function (err, ok) {
                        console.log("#############", err, ok);
                    });
                }, RETRY_TIMEOUT);
            }
            
            }, {
              // see https://www.rabbitmq.com/confirms.html for details
              noAck: false
        });

    } catch (error) {

        console.log(error);
    }

})();
