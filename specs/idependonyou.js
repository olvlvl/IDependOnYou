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