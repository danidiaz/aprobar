'use strict'

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

	static validateAndBuild(dto,preexistingGUID = null) {
        return this.validate(dto)
                   .then((dto) => {
		                const guid = preexistingGUID || uuidV4();
                        return new User(dto,guid);
                   });
	}
};
