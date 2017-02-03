'use strict'

function renderUser(user) {
    return { 
      email : user.email,
      name : user.name,
      isAdmin : user.admin
    };
}

module.exports.user = {
    render: renderUser
};

