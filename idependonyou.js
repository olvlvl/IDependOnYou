var IDependOnYou, define, module

!function () {

	"use strict";

	var pendingList = []
	, defineList = []
	, completedDefineList = []

	/**
	 * Representation of a definition.
	 */
	function Define(id, dependencyList, callback)
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

	IDependOnYou = {

		/**
		 * Add a Define.
		 *
		 * @param {string} id Dependency identifier.
		 * @param {Array} dependencyList
		 * @param {function} callback
		 */
		define: function (id, dependencyList, callback)
		{
			var instance = new Define(id, dependencyList, callback)

			pendingList.push(instance)
			defineList[id] = instance

			this.checkPending()

			return this
		},

		/**
		 * @param {string} id Dependency identifier.
		 *
		 * @returns {*}
		 */
		require: function (id)
		{
			if (!(id in completedDefineList))
			{
				throw new Error("Dependency not ready or not defined: `" + id + "`")
			}

			return completedDefineList[id]
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

	if (typeof module === 'object')
	{
		module.exports = {

			engine: IDependOnYou,
			define: define,
			require: IDependOnYou.require

		}
	}

} ();
