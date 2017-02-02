'use strict'

const mongoose = require('mongoose');

const userSchema = 
    new mongoose.Schema({
        // http://mongoosejs.com/docs/api.html#schematype_SchemaType-index
        email: { type: String, index: { unique: true } },
        name: String,
        admin: Boolean
    });

module.exports.User = mongoose.model('User',userSchema);
