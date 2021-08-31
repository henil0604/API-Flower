const APIFile = require("../helpers/APIFile");
const run = require("../helpers/run");


function createSandBox(req, res) {

    let sandBox = { };

    sandBox.req = { };
    sandBox.sandbox = { };

    sandBox.req.ip = req.clientIp;
    sandBox.req.method = req.method;
    sandBox.req.originalUrl = req.originalUrl;
    sandBox.req.params = req.params;
    sandBox.req.query = req.query;
    sandBox.req.body = req.body;

    sandBox.fetch = require("node-fetch");
    sandBox.helperJs = require("@henil0604/helperjs");

    sandBox.sandbox.APIid = req.params.id;

    return sandBox;
}

module.exports = async (req, res) => {

    try {
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

        if (runReturn && runReturn.____RETURN_TYPE_VM__ == "error") {
            runReturn = runReturn.e.message
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