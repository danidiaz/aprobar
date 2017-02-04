'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Waterline = require('waterline');
const mongoAdapter = require('sails-mongo');
const Promise = require('bluebird');

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

function orm(req) {
    return req.app[persistence.symbols.collections];
}

function userLink(req) {
    // Curried function.
    return user => fullUrl(req,'/users/'+user.guid);
}

// Can this be done using standard Express error handling?
function fallback(promiseReturningHandler) {
    return (req,res) => promiseReturningHandler(req,res).catch(e => {
        console.log(e);
        res.status(500).json(views.message('Unexpected error.'));
    });
}

app.get('/users',fallback((req,res) => 
    persistence.user
        .findAll(req.app[persistence.symbols.collections])
        .then(users => {
            res.json(views.hypermediaList(users,userLink(req)));
        })
));

app.get('/users/:userGuid',fallback((req,res) => 
    persistence.user
        .findByGuid(req.app[persistence.symbols.collections],
                    req.params.userGuid)
        .then(user => {
            if (!user) {
                return res.status(404).json(views.message('Not found'));
            } 
            res.json(views.user.render(user));
        })
));

// http://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
app.delete('/users/:userGuid',fallback((req,res) => 
    persistence.user
        .destroy(req.app[persistence.symbols.collections],req.params.userGuid)
        .then(() => {
            res.status(204).json({});
        })
));

app.put('/users/:userGuid',fallback((req,res) => 
    persistence.user
       .findByGuid(req.app[persistence.symbols.collections],
                        req.params.userGuid)
       .then(user => {
           if (!user) {
               return res.status(404).json(views.message('Not found'));
           }
           const dto = req.body;
           if (!user.isCompatible(dto)) {
               return res.status(409).json(views.message('Conflicting attributes.'));
           }
           // https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.6
           return persistence.user.update(req.app[persistence.symbols.collections]
                                         ,user.constructUpdated(dto)) 
                                  .then(() => res.status(200).json({}));
       })
));

app.post('/users',fallback((req,res) => {
    function checkConflicts(user) {
        return Promise
            .all([persistence.user.findByName(req.app[persistence.symbols.collections],user.name),
                 ,persistence.user.findByName(req.app[persistence.symbols.collections],user.email)])
            .then(([r1,r2]) => r1 || r2); 
    }
    return models
        .User.validateAndBuild(req.body)
        .then(user => {
            // Did we pass validation?
            if (!user) {
                return res.status(400).json(views.message('Bad request.'));
            }
            return checkConflicts(user).then(conflicts => {
                if (conflicts) {
                    return res.status(409).json(views.message('Conflict with existing resource.'));  
                } 
                return persistence.user
                    .create(req.app[persistence.symbols.collections],user)
                    .then(() => {
                         const link = userLink(req)(user); 
                         res.status(201).location(link).json(views.hypermedia(link));
                    });
            });
        });
}));

waterline.initialize(config, function(err, persistModels) {
	if(err) throw err;

	app[persistence.symbols.collections] = persistModels.collections;

	app.listen(aprobar_port, () => {
		console.log('started!');
	});
});
