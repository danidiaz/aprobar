'use strict'

const Promise = require('bluebird');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const chaiJsonEqual = require('chai-json-equal');
const dotenv = require('dotenv');
dotenv.config();

const configurations = require('../configurations');
const server = require('../server');

chai.use(chaiHttp);
chai.use(chaiJsonEqual);

server(
    configurations.waterlineConf,
    configurations.expressConf,
    tests
);

function tests(app) {
	describe('Users', function() {
		describe('emptyUsers', function() {
			it('Empty list of users at the beginning.',function() {
				return chai
                    .request(app)
                    .get('/users')	
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.jsonEqual([]);
                    });
			});
		});
	});
    run();
}

