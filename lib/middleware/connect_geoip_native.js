var geoip = require("geoip-native");

/*
	"require" all js file under a directory asynchronously,
	pass modules array to callback.

	@param {String} directory
	@param {Object|Function} options or callback
	@param {Function} callback
	@api public
*/
module.exports = function (options) {
	options = options || {};

	var xforward;
	xforward = options.xforward || false; // X-Forwarded-For switch

	return function (req, res, next) {
		var clientIP = null;

		// X-Forwarded-For for proxied client ip
		if (xforward) {
			clientIP = req.headers["x-forwarded-for"] &&
				req.headers["x-forwarded-for"].split(/ *, */)[0]
		}

		// express compatible
		if ((!clientIP) && req.ip) {
			clientIP = req.ip;
		} else {
			clientIP = clientIP || req.connection.remoteAddress;
		}

		try {
			req.geoip = geoip.lookup(clientIP);
			next();
		} catch (e) {
			next(e);
		}
	};
};