const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './src/debug-server.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../../public/index.html'),
		}),
	],
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx', '.css'],
		modules: ['./src/', 'node_modules'],
		alias: {
			react: 'preact/compat',
			'react-dom/test-utils': 'preact/test-utils',
			'react-dom': 'preact/compat', // Must be below test-utils
			'react/jsx-runtime': 'preact/jsx-runtime',
		},
	},
	mode: 'development',
	devServer: {
		static: {
			directory: path.resolve(__dirname, '../../public'),
		},
		port: 3000,
	},
	devtool: 'inline-source-map',
}
