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

module.exports.collectionHypermedia = 
    (collection,makeLink) => collection.map(item => hypermedia(makeLink(item)));
