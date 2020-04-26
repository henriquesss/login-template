require("dotenv").config();

const db = require("./libs/db");
db.connect();

const route = require("./routes/index.js");
const APP = route;
const API_PORT = process.env.API_PORT;
APP.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
