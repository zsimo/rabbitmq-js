"use strict";

var task = require("./task");


async function main () {


    var result01 = await task("task01");
    console.log(result01);
    var result02 = await task("task02");
    console.log(result02);
    var result03 = await task("task03");
    console.log(result03);

    var task04Promise = task("task04");
    var task05Promise = task("task05");
    var task06Promise = task("task06");
    var result04 = await task04Promise;
    var result05 = await task05Promise;
    var result06 = await task06Promise;
    console.log(result04);
    console.log(result05);
    console.log(result06);

    var result07 = await task("task07");
    console.log(result07);

}




main();