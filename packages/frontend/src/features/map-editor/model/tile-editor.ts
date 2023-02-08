import { createEvent, createStore } from 'effector'

export type ModeTileEditor = 'none' | 'draw-tile' | 'add-spawn'

const $mode = createStore<ModeTileEditor>('none')

const $activeCode = createStore<number | null>(null)
const $visibleCode = createStore(false)
const $visibleGrid = createStore(false)
const $cellSize = createStore(25)

const setMode = createEvent<ModeTileEditor>()

const selectedActiveCode = createEvent<number | null>()
const toggleVisibleCode = createEvent<boolean>()
const toggleVisibleGrid = createEvent<boolean>()
const changedCellSize = createEvent<number>()

$mode.on(setMode, (_, newMode) => newMode)
$mode.on(selectedActiveCode, (_, code) =>
	code === null ? 'none' : 'draw-tile'
)

$activeCode.on(selectedActiveCode, (_, code) => code)
$visibleCode.on(toggleVisibleCode, (_, visible) => visible)
$visibleGrid.on(toggleVisibleGrid, (_, visible) => visible)
$cellSize.on(changedCellSize, (_, size) => size)

export {
	$mode,
	$activeCode,
	$visibleCode,
	$visibleGrid,
	$cellSize,
	selectedActiveCode,
	toggleVisibleCode,
	toggleVisibleGrid,
	changedCellSize,
	setMode,
}
