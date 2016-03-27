var chai = require('chai')
, expect = chai.expect
, IDependOnYou = require('../idependonyou.js')
, define = IDependOnYou.define

describe('define', function() {

	var spyOne
	, spyTwo
	, spyThree

	it("should define 'three' with 'one' and 'two'", function() {

		define('three', [ 'one', 'two' ], function(one, two) {

			spyThree = true

			return 'three = ' + one + ' + ' + two

		})

	})

	it("should define 'one' with empty dependencies", function() {

		define('one', [], function() {

			spyOne = true

			return 'one'

		})

	})

	it("should define 'two' without dependencies", function() {

		define('two', function() {

			spyTwo = true

			return 'two'

		})

	})

	it("should define anon", function() {

		define(function() {

			return 'anon'

		})

	})

	it("shoud get 'three'", function() {

		define([ 'three' ], function(three) {

			expect(three).to.equal('three = one + two')

		})

	})

	it("should bring truth to spies", function() {

		expect(spyOne).to.be.true
		expect(spyTwo).to.be.true
		expect(spyThree).to.be.true

	})

})

describe('require', function () {

	var req1
	var req2
	var req1Name = 'req1-' + Math.random()
	var req2Name = 'req2-' + Math.random()
	var req1rc = 'req1rc-' + Math.random()
	var req2rc = 'req2rc-' + Math.random()

	it("should throw exception on undefined", function () {

		expect(function () { IDependOnYou.require(req1Name) }).to.throw(Error)

	})

	it("should throw exception on not ready", function () {

		define(req2Name, [ req1Name ], function () {

			return req2rc

		})

		expect(function () { IDependOnYou.require(req2Name) }).to.throw(Error)

	})

	it("should return factory result", function () {

		define(req1Name, function () {

			return req1rc

		})

		expect(IDependOnYou.require(req1Name)).to.equal(req1rc)
		expect(IDependOnYou.require(req2Name)).to.equal(req2rc)

	})

})
