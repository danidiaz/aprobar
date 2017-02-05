'use strict'

const mongoAdapter = require('sails-mongo');

module.exports.waterlineConf = (() => {
    const host = process.env.APROBAR_MONGO_HOST;
    const db = process.env.APROBAR_MONGO_DB;
    const port = parseInt(process.env.APROBAR_MONGO_PORT);
    if (isNaN(port)) {
        throw 'Invalid port format for mongo.'
    }
    return { 
        adapters: { 
            'sails-mongo': mongoAdapter 
        },
        connections: {
            mongo : {
                adapter : 'sails-mongo',
                host: host, 
                port: port,
                database: db
            }
        }
    }
})();

module.exports.expressConf = (() => {
    const host = process.env.APROBAR_HOST;
    const port = parseInt(process.env.APROBAR_PORT);
    if (isNaN(port)) {
        throw 'Invalid port format for express.'
    }
    return { host, port };
})();
