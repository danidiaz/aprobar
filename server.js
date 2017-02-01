'use strict'

require('dotenv').config();

const model = require('./model');

const express = require('express');

const app = express();

app.get('/',(req,res) => {
    res.send('foo');
});

app.listen(8000, () => {
    console.log('started!');
});
