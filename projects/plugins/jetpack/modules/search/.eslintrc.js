module.exports = {
	// Use root level ESlint configuration.
	// JavaScript files inside this folder are meant to be transpiled by Webpack.
	root: true,
	extends: [ '../../.eslintrc.js' ],
	rules: {
		'jsdoc/check-tag-names': [ 1, { definedTags: [ 'jsx' ] } ],
		'react/jsx-no-bind': 0,
	},
};
