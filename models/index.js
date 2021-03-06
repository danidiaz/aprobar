'use strict'

// This module validates data representations coming from the REST interface
// and constructs model entities from then.
//
// It also has the resposibility of assigning globally unique identifiers (GUIDs) to the created entities.

const joi = require('joi');
const uuidV4 = require('uuid/v4');
const Promise = require('bluebird');

function validateWith(validator,dto) {
    const promisified = Promise.promisify(validator.validate
                                         ,{context: validator});
    return promisified(dto);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class#Named_class_expressions
module.exports.User = class User {
    constructor(dto,guid) {
        this.guid = guid
        this.email = dto.email;
        this.name = dto.name;
        this.isAdmin = dto.isAdmin;
    }

    isCompatible(dto) {
        return this.email == dto.email && this.name == dto.name;
    }

    constructUpdated(dto) {
        return new User(dto,this.guid);
    }

    // https://www.npmjs.com/package/joi
    static get validator() {
        return joi.object().keys({
            email: joi.string().email().required(),
            name: joi.string().alphanum().min(3).max(90).required(),
            isAdmin: joi.boolean().required()
        });
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Static_methods
    static validate(dto) { return validateWith(this.validator,dto); }

    // Promise returns null if validation fails. Downstream should detect it.
    static validateAndBuild(dto,preexistingGUID = null) {
        return this.validate(dto)
                   .then(dto => {
                        const guid = preexistingGUID || uuidV4();
                        return new User(dto,guid);
                   }).catch(e => null);
    }
};
