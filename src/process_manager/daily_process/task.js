"use strict";

var min = 100;
var max = 2500;


module.exports = function (taskName) {

    var delay = Math.floor(Math.random() * (max - min + 1) + min);

    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(`task ${taskName} executed in ${delay}ms`);
        }, delay);
    })

};