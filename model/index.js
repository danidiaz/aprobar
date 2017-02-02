'use strict'

const mongoose = require('mongoose');

const userSchema = 
    new mongoose.Schema({
        email: String,
        name: String
    });

module.exports.User = mongoose.model('User',userSchema);
