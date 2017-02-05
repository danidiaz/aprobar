'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const chaiJsonEqual = require('chai-json-equal');
const url = require('url');
const dotenv = require('dotenv');
dotenv.config();

const configurations = require('../configurations');
const server = require('../server');

chai.use(chaiHttp);
chai.use(chaiJsonEqual);

function urlPath(urlString) {
    return url.parse(urlString).pathname;
}

server(
    configurations.waterlineConf,
    configurations.expressConf,
    tests
);

const validUser = { 
    "name" : "Rodolfo", 
    "email": "rodolfo@someemailprovider.com",
    "isAdmin" : true
};

function tests(app) {
    function testExpectedContent(path,content) {
        return function() {
            return chai.request(app).get(path)
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res.body).to.jsonEqual(content);
            });
        }
    }

    function testDeletion(path) {
        return function() { 
            return chai.request(app).delete(path)
            .then(function (res) {
                expect(res).to.have.status(204);
            });
        }
    }

    function testEmptyUserCollection() {
        return testExpectedContent('/users',[])();
    }

    function testInsertAndDeleteUser(user) {
        return function() { 
            return chai
            .request(app).post('/users').send(user)
            .then(function(res) {
                expect(res).to.have.status(201);
                const link = res.body.link;
                const relPath = urlPath(link);
                return testExpectedContent(relPath,user)()
                .then(testExpectedContent('/users',[{link}]))
                .then(testDeletion(relPath))
                // delete must be idempotent
                .then(testDeletion(relPath))
                // has it truly been deleted?
                .then(testExpectedContent('/users',[]));
            });
        }
    }

    function testInsertAndModifyUser(user) {
        let updatedUser = Object.assign({},user);
        updatedUser.isAdmin = !user.isAdmin;
        return function() { 
            return chai
            // First we create a user.
            .request(app).post('/users').send(user)
            .then(function(res) {
                const link = res.body.link;
                const relPath = urlPath(link);
                expect(res).to.have.status(201);
                // then we PUT a modified version.
                return chai.request(app).put(relPath).send(updatedUser)
                .then(function(res) {
                    expect(res).to.have.status(200);
                })
                // and we GET the resource to check we get the modification.
                .then(testExpectedContent(relPath,updatedUser));
            });
        }
    }

	describe('Users', function() {
        it('Empty list of users at the beginning.',testEmptyUserCollection);
        it('Insert and delete user.',testInsertAndDeleteUser(validUser));
        it('Insert and modify user.',testInsertAndModifyUser(validUser));
    });
    run();
}

