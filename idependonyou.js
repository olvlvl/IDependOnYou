var IDependOnYou, define, require

!function() {

	"use strict";

	var pendingList = []
	, defineList = []
	, completedDefineList = []

	/**
	 * Representation of a requirement.
	 */
	var Require = function(dependencyList, callback)
	{
		this.dependencyList = dependencyList
		this.callback = callback
	}

	Require.prototype = {

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
	 * Representation of a definition.
	 */
	var Define = function(id, dependencyList, callback)
	{
		this.id = id
		this.dependencyList = dependencyList
		this.callback = callback
	}

	Define.prototype = Object.create(Require.prototype)

	/**
	 * The engine.
	 */
	var Engine = function()
	{
	}

	Engine.prototype = {

		/**
		 * Add a Require.
		 */
		require: function(dependencyList, callback)
		{
			var instance = new Require(dependencyList, callback)

			pendingList.push(instance)

			this.checkPending()

			return this
		},

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

	if ('bind' in Function.prototype)
	{
		require = IDependOnYou.require.bind(IDependOnYou)
		define = IDependOnYou.define.bind(IDependOnYou)
	}
	else
	{
		require = function() { return IDependOnYou.require.apply(IDependOnYou, arguments) }
		define = function() { return IDependOnYou.define.apply(IDependOnYou, arguments) }
	}

	define.amd = {

		engine: "IDependOnYou"

	}

} ();