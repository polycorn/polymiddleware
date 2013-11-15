/*
	customise 'X-Powered-By' header or remove it.

	@param {Object} options
	@api public
*/
module.exports = function (options) {
	if (options && options.xpoweredby) {
		var xpoweredby = options.xpoweredby;
		return function (req, res, next) {
			res.setHeader('X-Powered-By', xpoweredby);
			next();
		};
	} else {
		return function (req, res, next) {
			if (req.app && req.app.enabled("x-powered-by")) { req.app.disable("x-powered-by"); }
			res.removeHeader("X-Powered-By");
			next();
		};
	}

};