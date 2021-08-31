module.exports = [
    {
        path: "/",
        middlewares: [
            (req, res) => {
                res.send("Welcome to API-flower")
            }
        ]
    },
    {
        path: "/api",
        type: "router",
        routes: require("./api.routes.js")
    }
]