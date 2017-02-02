'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const model = require('./model');

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.get('/',(req,res) => {
    res.send('foo');
});

app.listen(8000, () => {
    console.log('started!');
});
