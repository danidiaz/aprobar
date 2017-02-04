'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Waterline = require('waterline');
const mongoAdapter = require('sails-mongo');

const url = require('url');

const persistence = require('./persistence');
const views = require('./views');
const routes = require('./routes');

dotenv.config();

const waterline = new Waterline();
const config = (() => {
	const mongo_host = process.env.APROBAR_MONGO_HOST;
    const mongo_db = process.env.APROBAR_MONGO_DB;
    const mongo_port = parseInt(process.env.APROBAR_MONGO_PORT);
	if (isNaN(mongo_port)) {
		throw 'Invalid port format for mongo.'
	}

	return { 
		adapters: { 
			'sails-mongo': mongoAdapter 
		},
		connections: {
			mongo : {
				adapter : 'sails-mongo',
				host: mongo_host, 
				port: mongo_port,
				database: mongo_db
			}
		}
	}
})();
persistence.createCollections('mongo').map(collection => {
	// https://github.com/balderdashy/waterline-docs/blob/master/introduction/getting-started.md
	waterline.loadCollection(collection);
});

const aprobar_host = process.env.APROBAR_HOST;
const aprobar_port = parseInt(process.env.APROBAR_PORT);
if (isNaN(aprobar_port)) {
	throw 'Invalid port format.'
}
const fullUrl = (function(host,port) {
	return function(req,pathname) {
	  return url.format({
		protocol: req.protocol,
		hostname: host,
		port: port,
		pathname: pathname
	  })
	}
})(aprobar_host,aprobar_port);

function orm(req) {
    return req.app[persistence.symbols.collections];
}

// Can this be done using standard Express error handling?
function fallback(promiseReturningHandler) {
    return (req,res) => promiseReturningHandler(req,res).catch(e => {
        console.log(e);
        res.status(500).json(views.message('Unexpected error.'));
    });
}

// https://expressjs.com/en/api.html
const app = express();
// https://github.com/expressjs/body-parser
app.use(bodyParser.json());
app.use('/users',routes.users(orm,fallback,fullUrl));

waterline.initialize(config, function(err, waterlineModels) {
	if(err) throw err;

	app[persistence.symbols.collections] = 
        persistence.makeORM(waterlineModels.collections);

	app.listen(aprobar_port, () => {
		console.log('started!');
	});
});

module.exports = app; // for testing
