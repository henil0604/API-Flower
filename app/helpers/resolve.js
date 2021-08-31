const log = require("./log");
module.exports = (req, res) => {

    return (data = {}, statusCode, json = true) => {
        try {
            res.status(statusCode || data.statusCode || 200);
            res[json == true ? "json" : "send"](data || {})
            log(`RESPONSE SENT: ${data.responseCode || statusCode}`)
            return true;
        } catch (e) {
            log(`${e.message}`, "error")
            return false
        }
    }
}