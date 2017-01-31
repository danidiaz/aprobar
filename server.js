'use strict'

const express = require('express');

const app = express();

app.get('/',(req,res) => {
    res.send('foo');
});

app.listen(8000, () => {
    console.log('started!');
});
