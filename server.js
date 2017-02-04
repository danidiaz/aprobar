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

// https://expressjs.com/en/api.html
const app = express();
// https://github.com/expressjs/body-parser
app.use(bodyParser.json());

function userLink(req) {
    // Curried function.
    return user => fullUrl(req,'/users/'+user.guid);
}

app.get('/users',(req,res) => {
    persistence.user.findAll(req.app[persistence.symbols.collections])
                    .then(users => {
                        res.json(views.hypermediaList(users,userLink(req)));
                    }).catch(e => {
                        console.log(e);
                        res.status(400).json(views.message('Invalid request.'));
                    });
});

app.get('/users/:userGuid',(req,res) => {
    persistence.user.findByGuid(req.app[persistence.symbols.collections],
                                req.params.userGuid)
                    .then(user => {
                        res.json(views.user.render(user));
                    }).catch(e => {
                        console.log(e);
                        res.status(400).json(views.message('Invalid request.'));
                    });
});

// http://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
app.delete('/users/:userGuid',(req,res) => {
    persistence.user.destroy(req.app[persistence.symbols.collections],req.params.userGuid)
                    .then(() => {
                        res.status(204).json({});
                    }).catch(e => {
                        console.log(e);
                        res.status(400).json(views.message('Invalid request.'));
                    });
});

app.put('/users/:userGuid',(req,res) => {
    persistence.user.findByGuid(req.app[persistence.symbols.collections],
                                req.params.userGuid)
               .then(user => {
                   const dto = req.body;
                   if (user.isCompatible(dto)) {
                       // https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.6
                       return persistence.user.update(req.app[persistence.symbols.collections]
                                                     ,user.constructUpdated(dto)) 
                                         .then(() => res.status(200).json({}));
                   } else {
                       // https://httpstatuses.com/409
                       res.status(409).json(views.message('Conflicting attributes.'));
                   }
               }).catch(e => {
                    console.log(e);
                    res.status(400).json(views.message('Invalid request.'));
               });
});

app.post('/users',(req,res) => {
    function returnCreated(user) {
        const link = userLink(req)(user); 
        res.status(201)
           .location(link)
           .json(views.hypermedia(link));
    }
    models
        .User.validateAndBuild(req.body)
        .then(user => {
            // https://expressjs.com/en/api.html#req
            return persistence.user.create(req.app[persistence.symbols.collections]
                                          ,user)
                                   .then(returnCreated);
        }).catch(e => {
            console.log(e);
            // http://www.restapitutorial.com/httpstatuscodes.html
            res.status(400).json(views.message('Invalid request.'));
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
