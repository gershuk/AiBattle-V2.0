const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
	mode: 'development',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'public'),
		},
		port: 3000,
	},
	devtool: 'inline-source-map',
})
