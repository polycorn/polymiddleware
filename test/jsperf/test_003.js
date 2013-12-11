var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

var p1 = 7, p2 = 3, p3 = 6;

arr.forEach((function (a1, a2, a3) {
	return function (elm) {
		return a1 * a2 + a3 - elm;
	};
})(p1, p2, p3));

arr.forEach(function (elm) {
	return p1 * p2 + p3 - elm;
});

function c(c1,c2,c3,celm){
	return c1 * c2 + c3 - celm;
}
arr.forEach(function (elm) {
	return c(p1, p2, p3, elm);
});