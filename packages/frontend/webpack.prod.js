const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'public'),
					globOptions: {
						ignore: ['**/index.html'],
					},
				},
			],
		}),
	],
})
