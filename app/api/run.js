const APIFile = require("../helpers/APIFile");
const run = require("../helpers/run");


function createSandBox(req, res) {

    let sandBox = {};

    sandBox.req = {};
    sandBox.res = {};

    sandBox.req.ip = req.ip;
    sandBox.req.method = req.method;
    sandBox.req.originalUrl = req.originalUrl;

    sandBox.request = require("request");
    sandBox.helperJs = require("@henil0604/helperjs");

    return sandBox;
}

module.exports = async (req, res) => {

    try {
        let data = req.body;
        let id = req.params.id;

        const info = await APIFile.getInfo(id);
        if (!info) {
            return res.resolve(
                req.createResponse({
                    status: "error",
                    statusCode: 404,
                    message: "API not found",
                    responseCode: req.responseCode.NOT_FOUND
                })
            );
        }

        if ((info.method && info.method != "any") && req.method.toLowerCase() != info.method.toLowerCase()) {
            return res.resolve(
                req.createResponse({
                    status: "error",
                    statusCode: 405,
                    message: `Invalid Method. Expected "${info.method}"`,
                    responseCode: req.responseCode.INVALID_METHOD
                })
            );
        }

        let code = APIFile.get(id);

        let runReturn = await run(code, createSandBox(req, res))

        if (runReturn) {
            try {
                JSON.parse(runReturn)
            } catch (e) {
                runReturn = runReturn.message
            }
        }

        return res.resolve(
            req.createResponse({
                status: "success",
                statusCode: 200,
                message: "Code Executed!",
                responseCode: req.responseCode.CODE_EXECUTED,
                data: runReturn
            })
        )

    } catch (e) {
        console.warn(e);
        return res.resolve(
            req.createResponse({
                status: "error",
                statusCode: 500,
                message: "Something went wrong",
                responseCode: req.responseCode.INTERNAL_SERVER_ERROR
            })
        )
    }
}