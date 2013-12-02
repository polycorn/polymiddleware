/*
	only allow a single IP to access the server

	@param {Object} options
	@api public
*/
module.exports = function (options) {
	var ip = null, xforward, info = " ";
	options = options || {};

	var blockall = !!options.blockall;
	if (options.ip) { ip = options.ip; } // Customised IP
	xforward = options.xforward || false; // X-Forwarded-For switch
	info = options.info || info; // Customised message for other IPs

	return function (req, res, next) {
		if (blockall) { res.end(info); }

		var clientIP = null;

		// X-Forwarded-For for proxied client ip
		if (xforward) {
			clientIP = req.headers["x-forwarded-for"] &&
				req.headers["x-forwarded-for"].split(/ *, */)[0];
		}

		// express compatible
		if ((!clientIP) && req.ip) {
			clientIP = req.ip;
		} else {
			clientIP = clientIP || req.connection.remoteAddress;
		}

		// Set up the single IP source
		if (!ip) {
			ip = clientIP;
		}

		// Check IP
		if (clientIP == ip) {
			next();
		} else {
			req.end(info);
		}
	};
};