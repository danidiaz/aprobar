'use strict'

require('dotenv').config();

const model = require('./model');

const express = require('express');

const app = express();

//
const user = new model.User('addr','Some guy');
//

app.get('/',(req,res) => {
    res.send('foo');
});

app.listen(8000, () => {
    console.log('started!');
});
