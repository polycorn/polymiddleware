/*

	Store object has to have 3 functions: find, remove, add.

*/
(function () {

	// adapted from connect
	function merge(dest, src) {
		if (dest && src) {
			for (var prop in src) {
				dest[prop] = src[prop];
			}
		}
		return dest;
	}

	function MemoryStore() {
		this.ips = {};
	}

	MemoryStore.prototype.find = function (ip, cb) {
		if (cb) {
			process.nextTick(function () {
				cb(null, this.ips[ip]);
			});
		} else {
			return this.ips[ip];
		}
	};

	MemoryStore.prototype.remove = function (ip, cb) {
		if (cb) {
			process.nextTick(function () {
				if (this.ips[ip]) {
					try{
						delete this.ips[ip];
					}catch(e){
						
					}
				}
				cb(null);
			});
		} else {
			if (this.ips[ip]) {
				try{
					delete this.ips[ip];
				}catch(e){
					
				}
			}
		}
	};

	MemoryStore.prototype.add = function (ip, opt, cb) {
		if (typeof opt == "function") {
			cb = opt;
			opt = null;
		}
		if (cb) {
			process.nextTick(function () {
				cb(null, this.ips[ip] = merge({ "ip": ip }, opt));
			});
		} else {
			return this.ips[ip] = merge({ "ip": ip }, opt);
		}
	};

	module.exports = MemoryStore;
}).call(this);