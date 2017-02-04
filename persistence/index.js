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
    return [createUserCollection].map(f => f(connectionName));
};

// Symbols avoid the risk of collision when adding properties to the Express
// app.
module.exports.symbols = { 
    collections : Symbol('waterlineCollections')
};

function createUser(collections,user) {
    // https://github.com/balderdashy/waterline-docs/blob/master/introduction/getting-started.md
    // This particular model can be passed as-is, but remember other collections
    // might require some massaging. 
    return collections.user.create(user); 
}

function userFound(promise) {
    // propagate not found
    return promise.then(user => user && new models.User(user,user.guid));
}

function findUserByGuid(collections,guid) {
    return userFound(collections.user.findOneByGuid(guid));
}

function findUserByName(collections,name) {
    return userFound(collections.user.findOneByName(name));
}

function findUserByEmail(collections,email) {
    return userFound(collections.user.findOneByEmail(email));
}

function findAllUsers(collections) {
    return collections.user
                .find()
                .then(users => users.map(user => new models.User(user,user.guid)));
}

function destroyUserByGuid(collections,guid) {
    // http://es6-features.org/#PropertyShorthand
    return collections.user.destroy({ guid }); 
}

function updateUser(collections,user) {
    // This particular model can be passed as-is, but remember other collections
    // might require some massaging. 
    return collections.user.update({ guid: user.guid }, user);
}

module.exports.user = {
    create : createUser, 
    findByGuid : findUserByGuid,
    findByName : findUserByName,
    findByEmail : findUserByEmail,
	findAll : findAllUsers,
    destroy : destroyUserByGuid,
    update: updateUser
}
