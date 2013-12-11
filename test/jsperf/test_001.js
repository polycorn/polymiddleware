Benchmark.prototype.setup = function () {
	var obj = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	function normal_function(obj, index) {
		return obj[index];
	}

	function method(index) {
		return this[index];
	}

	obj.method = method;

	function closure(obj) {
		return function (index) {
			return obj[index];
		};
	}

	var bind = method.bind(obj);
};