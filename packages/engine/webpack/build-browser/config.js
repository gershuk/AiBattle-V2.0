const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	entry: './src/index.ts',
	mode: 'production',
	module: {
		rules: [
			{
				loader: 'ts-loader',
				exclude: [/node_modules/],
				options: {
					configFile: path.resolve(__dirname, 'tsconfig.json'),
				},
			},
		],
	},
	output: {
		path: path.resolve(__dirname, '../../build'),
		filename: 'engine.js',
		library: {
			name: 'engine',
			type: 'umd',
		},
	},
	resolve: {
		modules: ['./src/', 'node_modules'],
		extensions: ['.js', '.ts'],
	},
	optimization: {
		minimize: false,
		minimizer: [
			new UglifyJsPlugin({
				sourceMap: false,
				uglifyOptions: {
					compress: false,
					keep_classnames: true,
					keep_fnames: true,
				},
			}),
		],
	},
}
