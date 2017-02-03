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

// https://expressjs.com/en/api.html
const app = express();
// https://github.com/expressjs/body-parser
app.use(bodyParser.json());

app.get('/users',(req,res) => {
    res.send('foos');
});

app.get('/users/:userId',(req,res) => {
    res.send('foo');
});

app.post('/users',(req,res) => {
    models
        .User.validateAndBuild(req.body)
        .then((user) => {
            // https://expressjs.com/en/api.html#req
            return persistence.user.add(req.app[persistence.symbols.models],user);
        }).then(() => {
            res.json({ message : 'User created successfully.' });
        }).catch((e) => {
            console.log(e);
            // http://www.restapitutorial.com/httpstatuscodes.html
            res.status(400).json({ error : 'Invalid request.' });
        });
});

waterline.initialize(config, function(err, models) {
	if(err) throw err;

	app[persistence.symbols.models] = models.collections;
	app[persistence.symbols.connections] = models.connections;

	app.listen(8000, () => {
		console.log('started!');
	});
});
