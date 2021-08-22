const log = require("./log");
const helperJs = require("@henil0604/helperjs");

module.exports = (data) => {
    let response = {};

    response = {
        ...response,
        ...data,
    }

    response._ = {};

    response._.responseTime = Date.now();
    response._.responseToken = helperJs.random(helperJs.random.number(73, 231))

    log.fileLog({
        data: response
    });

    return response;
}