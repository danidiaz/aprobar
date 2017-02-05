'use strict'

const dotenv = require('dotenv');
dotenv.config();

const configurations = require('./configurations');
const server = require('./server');

server(
    configurations.waterlineConf,
    configurations.expressConf,
    (app) => {
        console.log('Server started!');
    }
);
