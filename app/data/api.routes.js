module.exports = [
    {
        type: "middleware",
        path: "/*",
        middlewares: [
            (req, res, next) => {
                req.requestReceivedAt = Date.now();
                res.resolve = require("../helpers/resolve")(req, res);
                req.createResponse = require("../helpers/createResponse");
                req.responseCode = require("./responseCode");

                next();
            }
        ]
    },
    {
        path: "/create",
        method: "POST",
        middlewares: [
            require("../api/create")
        ]
    },
    {
        path: "/:id",
        method: "all",
        middlewares: [
            require("../api/run")
        ]
    }
]