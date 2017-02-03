'use strict'

const joi = require('joi');
const uuidV4 = require('uuid/v4');
const Promise = require('bluebird');

function validateWith(validator,dto) {
	const promisified = Promise.promisify(validator.validate
										 ,{context: validator});
	return promisified(dto);
}

module.exports.User = class {
    constructor(dto,guid) {
        this.guid = guid
        this.email = dto.email;
        this.name = dto.name;
        this.isAdmin = dto.isAdmin;
    }

    // https://www.npmjs.com/package/joi
    static get validator() {
        return Joi.object().keys({
			email: Joi.string().alphanum().min(4).max(20).required(),
			name: Joi.string().alphanum().min(4).max(20).required(),
			isAdmin: Joi.boolean().required()
		});
    }

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Static_methods
	static validate(dto) { validateWith(this.validator,dto); }

	static validateAndBuild(dto,preexistingGUID) {
        return this.validate(dto)
                   .then((dto) => {
		                const guid = preexistingGUID || uuidV4.uuid();
                        return new User(dto,guid);
                   });
	}
}
