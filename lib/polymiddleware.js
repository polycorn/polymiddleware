/*
	"require" all middleware synchronously.

	@param {Object} options
	@api public
*/
function polymiddleware(options){

	options = options || {};

	/*
		Module dependencies
	*/
	var js_loader = require("./js_loader.js"),
		path = require("path"), join = path.join;
	
	/*
		helper functions
	*/
	function isString(o){
		return Object.prototype.toString.call(o) == "[object String]";
	}


	var dir = options.directory || join(__dirname, "middleware");
	return js_loader(dir);
}


module.exports = polymiddleware;