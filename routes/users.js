'use strict'

const express = require('express');
const Waterline = require('waterline');
const Promise = require('bluebird');

const url = require('url');

const models = require('../models');
const persistence = require('../persistence');
const views = require('../views');

module.exports = (orm,fallback,fullUrl) => {

    const router = express.Router();

    function userLink(req) {
        // Curried function.
        return user => fullUrl(req,req.baseUrl+'/'+user.guid);
    }

    router.get('/',fallback((req,res) => 
        orm(req).user
            .findAll()
            .then(users => {
                res.json(views.hypermediaList(users,userLink(req)));
            })
    ));

    router.get('/:userGuid',fallback((req,res) => 
        orm(req).user
            .findByGuid(req.params.userGuid)
            .then(user => {
                if (!user) {
                    return res.status(404).json(views.message('Not found'));
                } 
                res.json(views.user.render(user));
            })
    ));

    // http://stackoverflow.com/questions/2342579/http-status-code-for-update-and-delete
    router.delete('/:userGuid',fallback((req,res) => 
        orm(req).user
            .destroy(req.params.userGuid)
            .then(() => {
                res.status(204).json({});
            })
    ));

    router.put('/:userGuid',fallback((req,res) => 
        orm(req).user
           .findByGuid(req.params.userGuid)
           .then(user => {
               if (!user) {
                   return res.status(404).json(views.message('Not found'));
               }
               const dto = req.body;
               if (!user.isCompatible(dto)) {
                   return res.status(409).json(views.message('Conflicting attributes.'));
               }
               // https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.6
               return orm(req).user
                        .update(user.constructUpdated(dto)) 
                        .then(() => res.status(200).json({}));
           })
    ));

    router.post('/',fallback((req,res) => {
        function checkConflicts(user) {
            return Promise
                .all([orm(req).user.findByName(user.name),
                     ,orm(req).user.findByName(user.email)])
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
                    return orm(req).user
                        .create(user)
                        .then(() => {
                             const link = userLink(req)(user); 
                             res.status(201).location(link).json(views.hypermedia(link));
                        });
                });
            });
    }));

    return router;
}

