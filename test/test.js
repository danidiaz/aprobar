'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Array', function() {
      describe('#indexOf()', function() {
			describe('foo', function() {
              it('should return -1 when the value is not present', function() {
                        assert.equal(-1, [1,2,3].indexOf(4));
              });
            });
		});
});
