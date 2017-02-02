'use strict'

const mongoose = require('mongoose');

module.exports.userSchema = 
    new mongoose.Schema({
        email: String,
        name: String
    });
