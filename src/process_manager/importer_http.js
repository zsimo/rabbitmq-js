#!/usr/bin/env node

"use strict";

var path = require("path");
var config = require(path.resolve(process.cwd(), "src", "config"));
var httpClient = require(path.resolve(process.cwd(), "src", "http"));
var common = require(path.resolve(process.cwd(), "src", "process_manager", "common"));
var counter = 0;

var routingKey = process.argv[2] || common.ip + ".process_name";
var message = process.argv[3] || "command sent via http";

/**
 * when the publisher post directly on queue, it post via the default exchange
 * (with the routing key equal to the queue name)
 */
(async function () {

    try {

        var url = config.RABBIT_SERVER_BASE_URL + "/api/exchanges/v1/simone_process_manager_topic/publish";
        var data = {
            "properties": {},
            "routing_key": routingKey,
            "payload": message,
            "payload_encoding": "string"
        };
        var options = {
            method: "post",
            url: url,
            auth: {
                username: config.RABBIT_SERVER_USERNAME,
                password: config.RABBIT_SERVER_PASSWORD
            },
            data: data
        };

        setInterval(async function () {
            var result = await httpClient(options);
            console.log(`published#${counter++}: routing key: '${routingKey}', message: '${message}, routed: ${result.data.routed}`);
        }, 1000);
        

    } catch (error) {

        console.log(error);
    }

})();
