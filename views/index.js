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

module.exports.hypermedia = (link) => ({ link : link });
