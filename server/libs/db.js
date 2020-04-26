/**
 *  Biblioteca para modelar os dados da aplicação no MongoDB
 *  @constant
 *  @requires mongoose
 */
const mongoose = require("mongoose");

function connect() {
    mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, user: process.env.DB_USER, pass: process.env.DB_PASS });
    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("we're connected!");
    });
}

module.exports = { connect };