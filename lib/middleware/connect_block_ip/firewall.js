/*

	Firewall object has three functions: block, unblock and middleware.

	new Firewall(options) : create a Firewall object. customised store object
							can be provided in "options".

*/
(function () {
	var firewall,
		MemoryStore = require("./store.js");

	// adapted from connect
	var http = require("http");
	function merge(dest, src) {
		if (dest && src) {
			for (var prop in src) {
				dest[prop] = src[prop];
			}
		}
		return dest;
	}
	function error(code, msg) {
		var err = new Error(msg || http.STATUS_CODES[code]);
		err.status = code;
		return err;
	};

	// Firewall class
	function Firewall(options) {
		//this.xforward = false;
		//this.info = "";

		merge(this, options);

		this.store = this.store || new MemoryStore();
	}

	Firewall.prototype.block = function (ip, time) {
		this.store.add(ip, time && { "expired_time": time });
	};

	Firewall.prototype.unblock = function (ip) {
		this.store.remove(ip);
	};

	Firewall.prototype.middleware = function (req, res, next) {
		if (!(req.block && req.unblock)) {
			req.block = this.block.bind(this);
			req.unblock = this.unblock.bind(this);
		}

		var ip = null;
		// X-Forwarded-For for proxied client ip
		if (this.xforward) {
			ip = req.headers["x-forwarded-for"] &&
				req.headers["x-forwarded-for"].split(/ *, */)[0];
		} else {
			ip = req.ip || req.connection.remoteAddress;
		}

		if (ip) {
			this.store.find(ip, function (err, client) {
				if (err) {	// query error
					next(err);
				} else if (!client) {	// not in the store
					next();
				} else if (client.expired_time > Date.now()) {	// block expired
					this.store.remove(client.ip);
					next();
				} else {	// blocking
					next(error(400, this.info || "Invalid client"));
				}
			});
		} else {
			next(error(400, this.info || "Invalid client"));
		}
	};


	// export module
	firewall = function (options) {
		return new Firewall(options);
	};

	firewall.Firewall = Firewall;
	firewall.MemoryStore = MemoryStore;

	module.exports = firewall;
}).call(this);