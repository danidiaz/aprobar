'use strict'

require('dotenv').config();

const mongoose = require('mongoose');
// http://mongoosejs.com/docs/promises.html
mongoose.Promise = require('bluebird');

const db = mongoose.createConnection('localhost', 'aprobar');

const model = require('./model');

const user = new model.User('addr','Some guy');

const express = require('express');

const app = express();

app.get('/',(req,res) => {
    res.send('foo');
});

app.listen(8000, () => {
    console.log('started!');
});
