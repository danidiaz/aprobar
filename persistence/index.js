'use strict'

// https://github.com/balderdashy/waterline-docs/blob/master/models/data-types-attributes.md
const Waterline = require('waterline');

const models = require('../models');

function createUserCollection(connectionName) {
    return Waterline.Collection.extend({
        identity: 'user',
        connection: connectionName,
        autoPK: false,
        attributes: {
            guid: {
                type: 'string',
                primaryKey: true,
                unique : true
            },
            email: {
                type: 'string',
                unique: true,
            },
            name: {
                type: 'string',
                unique: true,
            },
            isAdmin: {
                type: 'boolean'
            }
        }
    });
}

module.exports.createCollections = function(connectionName) {
    return [createUserCollection].map((f) => f(connectionName));
};

// Symbols avoid the risk of collision when adding properties to the Express
// app.
module.exports.symbols = { 
    collections : Symbol('waterlineCollections'),
    connections : Symbol('waterlineConnections')
};

function createUser(collections,user) {
    // https://github.com/balderdashy/waterline-docs/blob/master/introduction/getting-started.md
    // This particular model can be passed as-is, but remember other collections
    // might require some massaging. 
    return collections.user.create(user); 
}

function findUserByGuid(collections,guid) {
    return collections
                .user.findOneByGuid(guid)
                .then((user) => new models.User(user,user.guid));
}

function findAllUsers(collections) {
    return collections
                .user.find()
                .then((userList) => {
                    return userList.map((user) => new models.User(user,user.guid));
                });
}

module.exports.user = {
    create : createUser, 
    findByGuid : findUserByGuid,
	findAll : findAllUsers
}
