const fs = require("fs");
const mongo = require("./mongo");
const env = require("./env");
const helperJs = require("@henil0604/helperjs");
const path = require("path");
var appRoot = require('app-root-path');

let APIFile = { };

function checksFolder() {
    const folderPath = path.join(
        appRoot.path,
        env("APIS_PATH") || "/apis"
    )

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    return folderPath;
}

function parseCode(code) {
    code = code.replace(/\\n/g, "\n")
    code = code.replace(/\\r\\n/g, "\n")
    code = code.replace(/\\t/g, "\t")

    return code;
}

APIFile.create = async (data = { }) => {

    try {
        const db = (await mongo()).useDb(env("MONGO_DBNAME"));
        const apis = await db.collection(env("MONGO_API_COLLECTION_NAME"));

        data.id = helperJs.random(43);

        const filePath = path.join(
            checksFolder(),
            `${data.id}.js`
        );

        data.code = parseCode(data.code);
        fs.writeFileSync(filePath, data.code)

        delete data.code;
        apis.insertOne(data);

        return data.id;
    } catch (e) {
        return null;
    }
}

APIFile.getInfo = async (id) => {

    try {
        const db = (await mongo()).useDb(env("MONGO_DBNAME"));
        const apis = await db.collection(env("MONGO_API_COLLECTION_NAME"));

        return apis.findOne({ id });
    } catch (e) {
        return null;
    }
}

APIFile.get = (id) => {
    try {
        return fs.readFileSync(path.join(checksFolder(), `${id}.js`)).toString();
    } catch (e) {
        return null
    }
}

APIFile.delete = async (id) => {

}

APIFile.test = (id) => {

    try {

        let api = require(`../../apis/${id}`);

        let toRun = typeof api == "function" ? api : typeof api.default == "function" ? api.default : null;

        if (typeof toRun != "function") {
            return false
        }

        return true;

    } catch (e) {
        return false
    }
}



module.exports = APIFile;