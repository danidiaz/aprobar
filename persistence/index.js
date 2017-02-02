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
}

