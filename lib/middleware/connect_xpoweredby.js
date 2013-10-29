module.exports = function (options) {
	if (options && options.xpoweredby) {
		var xpoweredby = options.xpoweredby;
		return function (req, res, next) {
			res.setHeader('X-Powered-By', xpoweredby);
			next();
		};
	} else {
		return function (req, res, next) {
			res.removeHeader("X-Powered-By");
			next();
		};
	}

}