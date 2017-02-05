'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dotenv = require('dotenv');
dotenv.config();

const configurations = require('../configurations');
const server = require('../server');

chai.use(chaiHttp);

server(
    configurations.waterlineConf,
    configurations.expressConf,
    tests
);

function tests(app) {
	describe('Users', function() {
		describe('emptyUsers', function() {
			it('Empty list of users at the beginning.',function(done) {
				chai.request(app)
					.get('/users')	
					.end(function(err,res) {
						if (err) throw err;
						expect(res).to.have.status(200);
						done();		
					});
			});
		});
	});
    run();
}

