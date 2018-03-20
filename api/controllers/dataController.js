"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = function (req, res) {
    return res.end("test");
};
exports.newdata = function (callback) {
    return function (req, res) {
        console.log("data: " + JSON.stringify(req.body));
        callback(req.body);
        return res.end("thanks");
    };
};
