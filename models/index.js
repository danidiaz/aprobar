'use strict'

module.exports.User = class {
    constructor(email,name,isAdmin) {
        this.email = email;
        this.name = name;
        this.isAdmin = isAdmin;
    }
}