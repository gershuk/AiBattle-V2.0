import { createEvent, createStore } from 'effector'

const $activeCode = createStore<number | null>(null)
const $visibleCode = createStore(false)
const $visibleGrid = createStore(false)
const $cellSize = createStore(25)

const selectedActiveCode = createEvent<number | null>()
const toggleVisibleCode = createEvent<boolean>()
const toggleVisibleGrid = createEvent<boolean>()
const changedCellSize = createEvent<number>()

$activeCode.on(selectedActiveCode, (_, code) => code)
$visibleCode.on(toggleVisibleCode, (_, visible) => visible)
$visibleGrid.on(toggleVisibleGrid, (_, visible) => visible)
$cellSize.on(changedCellSize, (_, size) => size)

export {
	$activeCode,
	$visibleCode,
	$visibleGrid,
	$cellSize,
	selectedActiveCode,
	toggleVisibleCode,
	toggleVisibleGrid,
	changedCellSize,
}
