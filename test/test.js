'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const Promise = require('bluebird');
const server = require('../server');

chai.use(chaiHttp);

describe('Users', function() {
    describe('emptyUsers', function() {
		it('User list should be empty at the beginning',function() {
			chai.request('http://localhost:8000')
			//chai.request(server)
				.get('/users')	
				.send({})
				.then(function (res) {
				    expect(res).to.have.status(400);
				})
				.catch(function (err) {
				   throw err;
				});
		});
	});
});

//describe('Array', function() {
//      describe('#indexOf()', function() {
//			describe('foo', function() {
//              it('should return -1 when the value is not present', function() {
//					expect(2).to.equal(2);
//              });
//            });
//		});
//});
