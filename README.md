# Express Boiler Plate

A simple Boiler Plate code for Creating Express Based Server

## Project Structure
```bash
├───app/
│   ├───data/
│   │   └───routes.js
│   ├───helpers/
│   │   ├───env.js
│   │   ├───log.js
│   │   └───mongo.js
│   ├───middlewares/
│   │   ├───hit.js
│   │   ├───rate-limiter.js
│   │   └───RouterManager.js
│   └───index.js
├───.gitignore
├───package-lock.json
├───package.json
├───README.md
└───server.js
```

------

## Installation

1. Clone the github Repo.
```bash
npx degit henil0604/express-boiler <projectname>
```

2. install the packages
```bash
cd <projectname>
npm install
```

3. Run the Server
```bash
npm run dev
```
------

## Usage
----
#### Helpers

##### env.js
```js
const env = require("app/helpers/env")

const PORT = env("PORT");

...

```

- Usage: To Grab Environment Variables from `.env` files
- Parameters: 
    - `key`: the key value you want to grab from the environment variables
    - `filter`:
        - default: `true`
        - Usage: Filters the String like `false`, `true` to their original type

##### log.js
```js
const log = require("app/helpers/log");

log("Hello, World!");
...
```

![image](https://user-images.githubusercontent.com/62794871/129442872-adbd7f60-b9e0-4b06-8f01-32779da4a3d9.png)
![image](https://user-images.githubusercontent.com/62794871/129442941-2d3b03c5-1453-4434-9e72-50d36263e3c6.png)


- Usage: Log to the Console in different Colors
- Parameters:
    - `text`: a text you want to log
    - `status`:
        - default: `info`
        - possible: `info`, `log`, `success`, `warn`, `error`
    - `prefix`: 
        - default: `>`
    - `fileLogging`:
        - Usage: Tell the log function if the data could be logged to `.json` file
        - default: `env("FILE_LOG_PATH")`

```js
log("Something Wrong Happened", "error", "[SERVER]")
```
![image](https://user-images.githubusercontent.com/62794871/129443085-2402831d-3ce0-4af9-bb03-2c2f28048a8b.png)

##### mongo.js
```js
const mongo = require("app/helpers/mongo");

const getUser = async (userId)=>{
    const collection = (await mongo()).useDb("helloworld").collection("users");

    return collection.findOne({userId});
}
```

- Usage: Mongo Helper Function directly gives your access over `MongoClient` Object
- Parameters:
    - `connectionURI`:
        - default: `env("MONGO_CONNECTION_URI")`
------

#### Middlewares

Middleware Helper Function

##### hit.js
```js
...

app.use(require("app/middlewares/hit"));

...
```
![image](https://user-images.githubusercontent.com/62794871/129443314-12bc8ff2-623c-47b6-965f-239734e9b7f9.png)

- Usage: use `log` (Helper Function) to log Every Incoming Request


##### rate-limmiter.js
```js
const rateLimiter = require("app/middlewares/rate-limiter");

app.use(rateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10
}))

```

- `rate-limiter.js` uses [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)

##### RouterManager.json
```js

const RouterManager = require("app/middlewares/RouterManager");

RouterManager(
    app,
    require("./app/data/routes")
)

```

- Usage: Allows you to Setup `hitpoints`, `staticserve`, `middlewares`, `nested-routers` by just Providing `JSON` Object
- Parameters:

    `app`: Provide `app` or `router` object

    `data`: Provide `JSON` Object Containing `hitpoint` Data



###### `JSON` data for Using `RouterManager` Middleware

- Simple Endpoint
    ```js
    {
        path: "/",
        method: "GET",
        type: "hitpoint",
        middlewares: [
            (req, res) => {
                res.send("Hello World")
            }
        ]
    },
    ```

- Static Serve
    ```js
    {
        path: "/",
        type: "static",
        serve: path.join(appRoot, "public")
    },
    ```

- Nested Router
    ```js
    {
        path: "/api",
        type: "router",
        routes: [
            {
                path: "/create-account",
                method: "POST",
                middlewares: [
                    (req, res)=>{
                        res.send("Account Created")
                    }
                ]
            }
        ]
    }
    ```

- Middleware
    ```js
    {
        path: "/admin",
        type: "middleware",
        middlewares: [
            (req, res)=>{
                if(isAdmin(req.user)){
                    next();
                }
                res.send("Not Allowed");
            }
        ]
    }
    ```


## Enjoy!

-----

# Coded By [Henil Malaviya](https://github.com/henil0604) With ❤️