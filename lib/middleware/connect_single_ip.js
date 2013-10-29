module.exports = function (options) {
	var ip = null, xforward;
	options = options || {};
	if (options.ip) { ip = options.ip; }
	xforward = options.xforward || false;

	return function (req, res, next) {
		var clientIP=null;

		if (xforward) {
			clientIP = req.headers["x-forwarded-for"] &&
				req.headers["x-forwarded-for"].split(/ *, */)[0]
		}

		if (req.ip) {
			clientIP = req.ip;
		} else {
			clientIP = clientIP || req.connection.remoteAddress;
		}

		if (!ip) {
			ip = clientIP;
		}

		if (clientIP == ip) {
			next();
		} else {
			req.end(" ");
		}
	};
};