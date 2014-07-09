var IDependOnYou, define

!function() {

	"use strict";

	var pendingList = []
	, defineList = []
	, completedDefineList = []

	/**
	 * Representation of a definition.
	 */
	var Define = function(id, dependencyList, callback)
	{
		this.id = id
		this.dependencyList = dependencyList
		this.callback = callback
	}

	Define.prototype = {

		isReady: function()
		{
			var dependencyList = this.dependencyList

			for (var i = 0, j = dependencyList.length ; i < j ; i++)
			{
				var dependencyId = dependencyList[i]

				if (!(dependencyId in completedDefineList))
				{
					return false
				}
			}

			return true
		},

		/**
		 * Invoke the callback with the required dependencies.
		 *
		 * @returns The value returned by the callback.
		 */
		initialize: function()
		{
			var argList = []
			, dependencyList = this.dependencyList
			, dependencyId

			for (var i = 0, j = dependencyList.length ; i < j ; i++)
			{
				dependencyId = dependencyList[i]

				argList.push(completedDefineList[dependencyId])
			}

			return this.callback.apply(null, argList)
		}

	}

	/**
	 * The engine.
	 */
	var Engine = function()
	{
	}

	Engine.prototype = {

		/**
		 * Add a Define.
		 */
		define: function(id, dependencyList, callback)
		{
			var instance = new Define(id, dependencyList, callback)

			pendingList.push(instance)
			defineList[id] = instance

			this.checkPending()

			return this
		},

		/**
		 * Check pending Requires and Defines.
		 */
		checkPending: function()
		{
			for (var i = 0 ; i < pendingList.length ; )
			{
				var pending = pendingList[i]

				if (!pending.isReady())
				{
					i++

					continue
				}

				var rc = pending.initialize()

				if (pending instanceof Define)
				{
					completedDefineList[pending.id] = rc
				}

				pendingList.splice(i, 1)

				i = 0 // restart
			}
		}

	}

	IDependOnYou = new Engine

	var anonymousCount = 0

	define = function() {

		var arg0, arg1 = [], arg2

		for (var i = 0, j = arguments.length ; i < j ; i++)
		{
			var value = arguments[i]

			switch (typeof value)
			{
				case 'string':

					arg0 = value

					break

				case 'object':

					arg1 = value

					break

				case 'function':

					arg2 = value

					break
			}
		}

		if (arg0 === undefined)
		{
			arg0 = '__ano_' + (++anonymousCount)
		}

		if (arg2 === undefined)
		{
			throw new Error('A factory is required.')
		}

		return IDependOnYou.define(arg0, arg1, arg2)
	}

	define.amd = {

		engine: "IDependOnYou"

	}

	if (typeof module == 'object')
	{
		module.exports = {

			engine: Engine,
			instance: IDependOnYou,
			define: define

		}
	}

} ();