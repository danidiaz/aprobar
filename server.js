'use strict'

require('dotenv').config();

const model = require('./model');
const userModel = new model.User('addr','Some guy');

const mongoose = require('mongoose');
// http://mongoosejs.com/docs/promises.html
mongoose.Promise = require('bluebird');

const db = mongoose.createConnection('localhost', 'aprobar');

let userSchema = new mongoose.Schema({
    email: String,
    name: String
});

let User = db.model('User',userSchema);

const express = require('express');

const app = express();

app.get('/',(req,res) => {
    res.send('foo');
});

app.listen(8000, () => {
    console.log('started!');
});
