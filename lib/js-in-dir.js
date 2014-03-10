(function () {
	var fs = require("fs"),
		path = require("path"),
		join = path.join,
		async = setImmediate; //process.nextTick;

	function req_mod(array, dir, fn) {
		try {
			var mod = require(join(dir, fn));
			array.push(mod);
			array[fn.replace(/\.js$|\.node$/i, "")] = mod;
		} catch (e) {

		}
	}

	function test_js(fn) {
		return (/\.js$|\.node$/i.test(fn));
	}

	function test_dir(dir, fn) {
		return fs.statSync(join(dir, fn)).isDirectory();
	}

	function filter_true() { return true; }

	function test_and_load(ret, filter, dir, fn) {
		if ((test_js(fn) || test_dir(fn)) && filter(dir, fn)) {
			req_mod(ret, dir, fn);
		}
	}

	function load_sync(dir, filter) {
		filter = filter || filter_true;
		var ret = [];

		fs.readdirSync(dir).forEach(function (fn) {
			test_and_load(ret, filter, dir, fn);
		});

		return ret;
	}

	function async_foreach(array, func, cb) {
		var len = array.length,
			ret = [],
			count = len;

		while (len > 0) {
			len -= 1;
			(function (i) {
				async(function () {
					ret[i] = func(array[i], i, array);
					count -= 1;
					if (count <= 0) {
						cb(null, ret);
					}
				});
			})(len);
		}
	}


	function load_async(dir, filter, cb) {
		var ret = [];
		filter = filter || filter_true;

		fs.readdir(dir, function (err, files) {
			if (err) {
				cb(err);
			} else {
				async_foreach(files, function (fn) {
					test_and_load(ret, filter, dir, fn);
				}, function (err, mods) {//mods is not needed
					if (err) {
						cb(err);
					} else {
						cb(null, ret);
					}
				})
			}
		})
	}

	module.exports.load_sync = load_sync;
	module.exports.load_async = load_async;

}).call(this);