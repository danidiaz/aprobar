'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const server = require('../server');

chai.use(chaiHttp);

setTimeout(function () {
	describe('Users', function() {
		describe('emptyUsers', function() {
			it('Return an empty list of users at the beginning',function(done) {
				chai.request('http://localhost:8000')
					.get('/users')	
					.end(function(err,res) {
						if (err) throw err;
						console.log(res);	
						expect(res).to.have.status(123);
						done();		
					});
			});
		});
	});
    run();
}, 3000);
