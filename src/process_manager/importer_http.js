#!/usr/bin/env node

"use strict";

var path = require("path");
var config = require(path.resolve(process.cwd(), "src", "config"));
var httpClient = require(path.resolve(process.cwd(), "src", "http"));
var common = require(path.resolve(process.cwd(), "src", "process_manager", "common"));
var counter = 0;

var routingKey = process.argv[2] || common.ip + ".process_name";
var message = process.argv[3] || "command sent via http";

const AUTH = {
    username: config.RABBIT_SERVER_USERNAME,
    password: config.RABBIT_SERVER_PASSWORD
};

/**
 * when the publisher post directly on queue, it post via the default exchange
 * (with the routing key equal to the queue name)
 */
(async function () {

    try {



        // =====================================================================
        // create exchange if it's not exists
        // =====================================================================
        var result = await httpClient({
            method: "put",
            url: `${config.RABBIT_SERVER_BASE_URL}/api/exchanges/${common.vhost}/${common.exchange_name}`,
            auth: AUTH,
            data: {
                "type": "topic",
                "durable": false,
                "auto_delete": false
            }
        });
        // console.log(result.status)
        // =====================================================================
        // create queue if it's not exists
        // =====================================================================
        result = await httpClient({
            method: "put",
            url: `${config.RABBIT_SERVER_BASE_URL}/api/queues/${common.vhost}/${common.queue_name}`,
            auth: AUTH,
            data: {
                "durable": false,
                "auto_delete": false
            }
        });
        // =====================================================================
        // bind exchange to queue
        // =====================================================================
        // await channel.bindQueue(common.queue_name, common.exchange_name, routingKey);
        // /api/bindings/vhost/e/exchange/q/queue/props
        result = await httpClient({
            method: "post",
            url: `${config.RABBIT_SERVER_BASE_URL}/api/bindings/${common.vhost}/e/${common.exchange_name}/q/${common.queue_name}`,
            auth: AUTH,
            data: {
                "routing_key": routingKey
            }
        });
        // console.log(result.status)

        var publishOptions = {
            method: "post",
            url: `${config.RABBIT_SERVER_BASE_URL}/api/exchanges/${common.vhost}/${common.exchange_name}/publish`,
            auth: AUTH,
            data: {
                "properties": {},
                "routing_key": routingKey,
                "payload": message,
                "payload_encoding": "string"
            }
        };
        setInterval(async function () {
            result = await httpClient(publishOptions);
            console.log(`published#${counter++}: routing key: '${routingKey}', message: '${message}, routed: ${result.data.routed}`);
        }, 1000);


    } catch (error) {

        console.log(error);
    }

})();
