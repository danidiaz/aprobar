'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Waterline = require('waterline');
const mongoAdapter = require('sails-mongo');
const url = require('url');

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
persistence.createCollections('mongo').map((collection) => {
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

// https://expressjs.com/en/api.html
const app = express();
// https://github.com/expressjs/body-parser
app.use(bodyParser.json());

function makeUserLink(req,user) {
	return { link : fullUrl(req,'/users/'+user.guid) };
}

app.get('/users',(req,res) => {
    persistence.user.findAll(req.app[persistence.symbols.collections])
                    .then((userList) => {
                        res.json(userList.map((user) => 
											  makeUserLink(req,user)));
                    }).catch((e) => {
                        console.log(e);
                        res.status(400).json({ message : 'Invalid request.' });
                    });
});

app.get('/users/:userGuid',(req,res) => {
    persistence.user.findByGuid(req.app[persistence.symbols.collections],
                                req.params.userGuid)
                    .then((user) => {
                        res.json(views.user.render(user));
                    }).catch((e) => {
                        console.log(e);
                        res.status(400).json({ message : 'Invalid request.' });
                    });
});

app.post('/users',(req,res) => {
    function returnCreated(user) {
        res.status(201)
           .location(link)
           .json({ message : 'User created successfully.',
                   link : makeUserLink(req,user)
                 });
    }
    models
        .User.validateAndBuild(req.body)
        .then((user) => {
            // https://expressjs.com/en/api.html#req
            return persistence.user.create(req.app[persistence.symbols.collections]
                                          ,user)
                                   .then(returnCreated);
        }).catch((e) => {
            console.log(e);
            // http://www.restapitutorial.com/httpstatuscodes.html
            res.status(400).json({ message : 'Invalid request.' });
        });
});

waterline.initialize(config, function(err, persistModels) {
	if(err) throw err;

	app[persistence.symbols.collections] = persistModels.collections;
	app[persistence.symbols.connections] = persistModels.connections;

	app.listen(aprobar_port, () => {
		console.log('started!');
	});
});
