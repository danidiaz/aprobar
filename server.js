'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Waterline = require('waterline');
const mongoAdapter = require('sails-mongo');

const models = require('./models');
const persistence = require('./persistence');
const views = require('./views');

dotenv.config();

const waterline = new Waterline();
const config = (() => {
	const mongo_host = process.env.APROBAR_MONGO_HOST;
    const mongo_db = process.env.APROBAR_MONGO_DB;
    const mongo_port = parseInt(process.env.APROBAR_MONGO_PORT);
	if (isNaN(mongo_port)) {
		throw 'Invalid port format.'
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
persistence.createCollections('mongo').map((collection) => {
	// https://github.com/balderdashy/waterline-docs/blob/master/introduction/getting-started.md
	waterline.loadCollection(collection);
});

const app = express();
app.use(bodyParser.json());

app.get('/',(req,res) => {
    res.send('foo');
});

waterline.initialize(config, function(err, models) {
	if(err) throw err;

	app[persistence.symbols.models] = models.collections;
	app[persistence.symbols.connections] = models.connections;

	app.listen(8000, () => {
		console.log('started!');
	});
});
