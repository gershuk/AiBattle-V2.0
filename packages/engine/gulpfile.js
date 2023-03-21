const gulp = require('gulp')
const ts = require('gulp-typescript')
const concat = require('gulp-concat')
const stripImportExport = require('gulp-strip-import-export')
const dependencyTree = require('dependency-tree')

const tsProject = ts.createProject('tsconfig.json', {
	target: 'ES2022',
})

gulp.task('default', function () {
	var list = dependencyTree.toList({
		filename: 'src/index.ts',
		directory: 'src',
		webpackConfig: './webpack.config.js',
		tsConfig: './tsconfig.json',
	})
	const files = list.filter(uri => !uri.includes('index.ts'))

	var tsResult = gulp.src(files).pipe(tsProject())

	return tsResult.js
		.pipe(concat('engine.js'))
		.pipe(stripImportExport())
		.pipe(gulp.dest('build-js'))
})
