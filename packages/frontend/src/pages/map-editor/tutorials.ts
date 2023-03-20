import { sample } from 'effector'
import { createTranslation, createTutorial } from 'libs'
import { createTutorialPanel } from 'ui'
import { $selectMap } from './model'

const { getTranslationItem } = createTranslation({
	ru: {
		maps: 'Твои карты',
		mapsMsg: 'Чтобы создать карту, воспользуйся мастером создания карты.',
		mapEditor: 'Редактор карты',
		jsonEditor: 'JSON редактор карты, структура простая, ты разберешься.',
		tileEditor: 'Тайловый редактор карты. Рисуй! Твори!',
		draw: 'Для рисования надо тыкнуть на нужный блок, невестись на карту справа нажать/зажать левую кнопку мышки.',
		zoom: 'Ты можешь уменьшать/увеличивать масштаб карты колёсиком мышки при нажатом ctrl. А также перемещать карту захватом мышки.',
		spawn: 'И не забудь добавить места появления ботов. Это очень важно!',
	},
	en: {
		maps: 'Your maps',
		mapsMsg: 'Use the map wizard to create a map.',
		mapEditor: 'Map Editor',
		jsonEditor: `JSON map editor.`,
		tileEditor: 'Map tile editor. Draw! Create!',
		draw: 'To draw, you need to click on the desired block, move to the map on the right press/hold the left mouse button.',
		zoom: 'You can zoom in/zoom out the map with the mouse wheel while pressing ctrl. You can also move the map with the mouse.',
		spawn: `And don't forget to add the spawn locations for the bots. It is very important!`,
	},
})

export const tutorialMapList = createTutorial({
	steps: [
		{
			message: () => getTranslationItem('mapsMsg'),
			title: () => getTranslationItem('mapEditor'),
			element: () => document.querySelector('.maps-list .add-map'),
			viewPosition: 'bottom-right',
		},
	],
	delayStart: 500,
	view: createTutorialPanel,
	id: 'map-list-tutorial',
})

export const tutorialMapEditor = createTutorial({
	steps: [
		{
			element: () => document.querySelector('.json-map-editor .code-editor'),
			message: () => getTranslationItem('jsonEditor'),
			viewPosition: 'bottom',
			title: () => getTranslationItem('mapEditor'),
		},
		{
			element: () => document.querySelector('.json-map-editor .preview-map'),
			message: () => getTranslationItem('tileEditor'),
			viewPosition: 'top',
			title: () => getTranslationItem('mapEditor'),
		},
		{
			element: () =>
				document.querySelector('.json-map-editor .type-cell-wrapper'),
			message: () => getTranslationItem('draw'),
			viewPosition: 'top-right',
			title: () => getTranslationItem('mapEditor'),
		},
		{
			element: () => document.querySelector('.json-map-editor .tile-map'),
			message: () => getTranslationItem('zoom'),
			viewPosition: 'top-left',
			title: () => getTranslationItem('mapEditor'),
		},
		{
			element: () =>
				document.querySelector('.json-map-editor .list-spawner-wrapper'),
			message: () => getTranslationItem('spawn'),
			viewPosition: 'top-right',
			title: () => getTranslationItem('mapEditor'),
		},
	],
	delayStart: 500,
	view: createTutorialPanel,
	id: 'editor-map-tutorial',
})

sample({
	clock: $selectMap,
	filter: Boolean,
	target: tutorialMapEditor.start,
})
