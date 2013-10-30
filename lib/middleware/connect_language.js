/*
	get language from 'Accept-Language', session (connect session middleware)
	 or cookies (express)

	@param {Object} options
	@api public
*/
var connect_language={};

connect_language.accept_language = function (options) {
	options = options || {};

	return function (req, res, next) {
		if (req.lang) { next(); }

		var accept_language = req.headers['accept-language'],
			lang, langs = [];

		if (accept_language) {
			accept_language.split(',').forEach(function (lang) {
				// TODO: Need to check the lang value before push to the array
				langs.push(lang.split(';', 1)[0].toLowerCase());
			});
		}

		if (langs.length > 0) {
			lang = langs[0];

			req.lang = lang;
			req.langs = langs;
		}

		next();
	};
};


connect_language.cookie = function (options) {
	options = options || {};
	var max_age = options.max_age || 31536000;

	return function (req, res, next) {
		if (req.lang) { next(); }

		if (req.cookies && req.cookies.lang &&
			typeof (req.cookies.lang) == "string" &&
			req.cookies.lang.length < 6) {

			req.lang = req.cookies.lang;
		} 

		next();

		if (res.cookie&&res.lang) {
			res.cookie("lang", res.lang, { maxAge: max_age });
		}
	};
};


connect_language.session = function (options) {
	options = options || {};

	return function (req, res, next) {
		if (req.lang) { next(); }

		if (req.session&&req.session.lang) {

			req.lang = req.session.lang;
		} 

		next();

		if (req.session&&res.lang) {
			req.session.lang=res.lang;
		}
	};
};

connect_language.default_language = function (options) {
	options = options || {};
	var default_lang = options.default_lang || "en";

	return function (req, res, next) {

		if (!req.lang) {
			req.lang = default_lang;
		}

		next();

		if (!res.lang) {
			res.lang = req.lang || default_lang;
		}
	};
};

module.exports = connect_language;