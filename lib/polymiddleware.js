(function () {

	/*
	Module dependencies
	*/
	var loader = require("./js-in-dir.js"),
		path = require("path"), join = path.join;

	/*
	"require" all middleware.

	@param {Object} options
	@api public
	*/
	function polymiddleware(options) {

		options = options || {};

		var dir = options.directory || join(__dirname, "middleware"),
			callback = options.callback,
			filter = options.filter;

		if (callback) {
			loader.load_async(dir, filter, callback);
		} else {
			return loader.load_sync(dir, filter);
		}

	}

	polymiddleware.load_async = loader.load_async;
	polymiddleware.load_sync = loader.load_sync;

	module.exports = polymiddleware;

}).call(this);