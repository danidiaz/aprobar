'use strict'

const Promise = require('bluebird');
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

function tests(app) {
    function testCollectionIsEmpty(path) {
        return function() {
            return chai.request(app).get(path).then(function(res) {
                expect(res).to.have.status(200);
                expect(res.body).to.jsonEqual([]);
            });
        }
    }

    function testDeletion(path) {
        return function() { 
            return chai.request(app).delete(path).then(function (res) {
                expect(res).to.have.status(204);
            });
        }
    }

    function testEmptyUserCollection() {
        return testCollectionIsEmpty('/users')();
    }

    function testInsertAndDeleteUser() {
        const user = { 
            "name" : "Rodolfo", 
            "email": "rodolfo@someemailprovider.com",
            "isAdmin" : true
        }
        return chai
            .request(app).post('/users').send(user)
            .then(function(res) {
                expect(res).to.have.status(201);
                const link = res.body.link;
                const relPath = urlPath(link);
                return Promise.all([
                    chai.request(app).get(relPath),
                    chai.request(app).get('/users')
                ])
                .then(function ([res,resCollection]) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.jsonEqual(user);
                    expect(resCollection).to.have.status(200);
                    const [{link:linkFromCollection}] = resCollection.body;
                    expect(linkFromCollection).to.equal(link);
                })
                .then(testDeletion(relPath))
                // delete must be idempotent
                .then(testDeletion(relPath))
                // has it truly been deleted?
                .then(testCollectionIsEmpty('/users'));
            });
    }

	describe('Users', function() {
        it('Empty list of users at the beginning.',testEmptyUserCollection);
        it('Insert and delete user.',testInsertAndDeleteUser);
    });
    run();
}


