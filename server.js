'use strict'

require('dotenv').config();

const mongoose = (function () { 
    const m = require('mongoose');
    // http://mongoosejs.com/docs/promises.html
    m.Promise = require('bluebird');
    return m;
})();

const db = (function () {
    const mongo_host = process.env.APROBAR_MONGO_HOST;
    const mongo_db = process.env.APROBAR_MONGO_DB;
    return mongoose.createConnection(mongo_host, mongo_db);
})();

const model = require('./model');

const app = (function () {
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    // http://stackoverflow.com/a/24635296/1364288
    app.use(bodyParser.json());
    return app;
})();

app.get('/',(req,res) => {
    res.send('foo');
});

app.listen(8000, () => {
    console.log('started!');
});
