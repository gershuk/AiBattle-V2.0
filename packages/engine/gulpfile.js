const gulp = require('gulp')
const ts = require('gulp-typescript')
const concat = require('gulp-concat')
const stripImportExport = require('gulp-strip-import-export')
const dependencyTree = require('dependency-tree')

const tsProject = ts.createProject('tsconfig.json', { target: 'ES2022' })

/**
 * Возвращает отсортированный массив uri файлов по дереву зависимостей
 */
const treeToArray = tree => {
	const flatTree = []
	const loop = (tree, depth = 0) => {
		const nodes = Object.entries(tree)
		nodes.forEach(([uri, node]) => {
			flatTree.push({ uri, depth })
			loop(node, depth + 1)
		})
	}
	loop(tree)

	const sortFlatTree = [...flatTree].sort((a, b) => b.depth - a.depth)
	const uniqNodes = sortFlatTree
		.map(({ uri }) => uri)
		.filter((value, index, array) => array.indexOf(value) === index)

	return uniqNodes
}

gulp.task('default', function () {
	var tree = dependencyTree({
		filename: 'src/index.ts',
		directory: 'src',
	})
	const files = treeToArray(tree).slice(0, -1)

	var tsResult = gulp.src(files).pipe(tsProject())

	return tsResult.js
		.pipe(concat('engine.js'))
		.pipe(stripImportExport())
		.pipe(gulp.dest('build-js'))
})
