/*
	Module dependencies
*/
var fs = require("fs"),
	path = require("path"),
	join = path.join;

/*
	"require" all js file under a directory synchronously,
	return an array contain all the modules.

	@param {String} directory
	@param {Object} options
	@api public
*/

module.exports = function (directory, options) {
	var ret = [],
		pre_filter = function () { return true; },
		post_filter = function () { return true; };

	if (options) {
		pre_filter = options.pre_filter || pre_filter;
		post_filter = options.post_filter || post_filter;
	}

	// read directory synchronously
	fs.readdirSync(directory).forEach(function (fn) {

		// is it a js file ? does it satisfy pre_filter function ?
		if (/\.js$/i.test(fn) && pre_filter(fn)) {
			// require the module
			var mod = require(join(dir, fn));
			// do a post filter before add to the array
			if (post_filter(mod)) {
				// module can be accessed in 2 ways:
				//
				//     ret["module name without '.js'"]
				//     ret[2]
				//
				// number of modules: ret.length
				ret[fn.replace(/\.js$/i, "")] = mod;
				ret.push(mod);
			}
		}

	});

	return ret;
};

/*
	"require" all js file under a directory asynchronously,
	pass modules array to callback.

	@param {String} directory
	@param {Object|Function} options or callback
	@param {Function} callback
	@api public
*/
module.exports.async = function (directory, options, callback) {
	// support callback function as the second argument
	if ("function" == typeof options) {
		callback = options;
		options = null;
	}

	var ret = [],
		pre_filter = function () { return true; },
		post_filter = function () { return true; };

	if (options) {
		pre_filter = options.pre_filter || pre_filter;
		post_filter = options.post_filter || post_filter;
	}

	// read directory asynchronously
	fs.readdir(directory, function (err, files) {
		if (!err) {
			files.forEach(function (fn) {
				// is it a js file ? does it satisfy pre_filter function ?
				if (/\.js$/i.test(fn) && pre_filter(fn)) {
					// require the module
					var mod = require(join(dir, fn));
					// do a post filter before add to the array
					if (post_filter(mod)) {
						// module can be accessed in 2 ways:
						//
						//     ret["module name without '.js'"]
						//     ret[2]
						//
						// number of modules: ret.length
						ret[fn.replace(/\.js$/i, "")] = mod;
						ret.push(mod);
					}
				}
			});
		}
		callback(err, ret);
	});
};