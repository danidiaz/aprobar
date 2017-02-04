'use strict'

function renderUser(user) {
    return { 
      email : user.email,
      name : user.name,
      isAdmin : user.isAdmin
    };
}

module.exports.user = {
    render: renderUser
};

const hypermedia = link => ({ link });
module.exports.hypermedia = hypermedia;

const message = message => ({ message });
module.exports.message = message;

module.exports.hypermediaList = 
    (collection,makeLink) => collection.map(item => hypermedia(makeLink(item)));
