/*
	
	A logger middleware provide logging style similar to console.log.

*/

(function () {

	var default_logger, default_format;
	{
		default_logger = function (error, string) {
			console.log("[" + error.toUpperCase() + "] " + string);
		};
		default_logger.info = function (string) {
			this("info", string);
		};
		default_logger.warn = function (string) {
			this("warn", string);
		};
		default_logger.error = function (string) {
			this("error", string);
		};
	}

	default_format = function (req, res) {
		return (res.statusCode + " " + req.method.toUpperCase() + " " +
				req.originalUrl + " " + (new Date() - req._startTime) +
				" ms " + (res.getHeader("Content-Length") || "unknown size"));
	}

	module.exports = function (options) {
		options = options || {};

		var logger = options.logger || default_logger,
			format = options.format || default_format;

		return function (req, res, next) {

			req._startTime = new Date();

			function log_req() {
				var code, stat, msg;

				res.removeListener("finish", log_req);
				res.removeListener("close", log_req);

				msg = format(req, res)

				if (msg) {
					code = res.statusCode;
					stat = code < 400 ? "info" : (code < 500 ? "warn" : "error");
					logger[stat](msg);
				}
			}

			res.on("finish", log_req);
			res.on("close", log_req);

			next();
		};

	};

}).call(this);