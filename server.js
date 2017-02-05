'use strict'

// What this module DOES KNOW about:
// - Creating the Waterline instance and setting up persistence collections.
// - Creating the Express Application instance.
// - Routes.

// What this module DOES NOT KNOW about:
// - Domain models.
// - Views.
// - The specific Waterline adapter we are using. 

const express = require('express');
const bodyParser = require('body-parser');
const Waterline = require('waterline');

const url = require('url');

const persistence = require('./persistence');
const routes = require('./routes');


// The Application object must have been augmented with an ORM previously.
function orm(req) {
    return req.app[persistence.symbols.collections];
}

// Can this be done using standard Express error handling?
function fallback(promiseReturningHandler) {
    return (req,res) => promiseReturningHandler(req,res).catch(e => {
        console.log(e);
        res.status(500).json({});
    });
}

// The callback receives the express Application object, once it is up and
// running.
function startServer(ormInstance,expressConf,appCallback) {
    const fullUrl = (req,pathname) =>
        url.format({
            protocol: req.protocol,
            hostname: expressConf.host,
            port: expressConf.port,
            pathname: pathname
        });

    const app = express();
    app[persistence.symbols.collections] = ormInstance;
    // https://github.com/expressjs/body-parser
    app.use(bodyParser.json());
    app.use('/users',routes.users(orm,fallback,fullUrl));
    app.listen(expressConf.port,expressConf.host, () => {
        appCallback(app);
    });
}

// The callback receives the express Application object, once it is up and
// running.
module.exports = function(waterlineConf,expressConf,appCallback) {
    const waterline = new Waterline();
    persistence.createCollections('mongo').forEach(collection => {
        // https://github.com/balderdashy/waterline-docs/blob/master/introduction/getting-started.md
        waterline.loadCollection(collection);
    });
    waterline.initialize(waterlineConf, function(err, waterlineModels) {
        if(err) throw err;

        startServer(
            persistence.makeORM(waterlineModels.collections),
            expressConf,
            appCallback
        );
    });
}
