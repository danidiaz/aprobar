'use strict'

// https://github.com/balderdashy/waterline-docs/blob/master/models/data-types-attributes.md
const Waterline = require('waterline');

function createUserCollection(connectionName) {
    return Waterline.Collection.extend({
        identity: 'user',
        connection: connectionName,
        autoPK: false,
        attributes: {
            email: {
                type: 'string',
                primaryKey: true,
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
    models : Symbol('waterlineModels'),
    connections : Symbol('waterlineConnections')
};

function addUser(models,user) {
    // https://github.com/balderdashy/waterline-docs/blob/master/introduction/getting-started.md
    // This particula model can be passed as-is, but remember other models
    // might require some massaging. 
    console.log('foo!');
    // console.log(models);
    console.log(models.user);
    console.log(user);
    return models.user.create(user); 
}

module.exports.user = {
    add : addUser 
}
