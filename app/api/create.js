const APIFile = require("../helpers/APIFile");

module.exports = async (req, res) => {

    try {
        let data = req.body;

        if (!data.name || !data.code) {
            return res.resolve(
                req.createResponse({
                    status: "error",
                    statusCode: 400,
                    message: "Invalid Fields Provided",
                    responseCode: req.responseCode.INVALID_DATA
                })
            )
        }

        const id = await APIFile.create(data)

        if (!id) {
            return res.resolve(
                req.createResponse({
                    status: "error",
                    statusCode: 400,
                    message: "Failed to Parse Code",
                    responseCode: req.responseCode.FAILED
                })
            )
        }

        return res.resolve(
            req.createResponse({
                status: "success",
                statusCode: 201,
                message: "API created Successfuly",
                responseCode: req.responseCode.SUCCESS,
                data: {
                    id: id
                }
            })
        )


    } catch (e) {
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