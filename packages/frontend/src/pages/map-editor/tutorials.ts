import { sample } from 'effector'
import { createTutorial } from 'libs/tutorial'
import { createTutorialPanel } from 'ui'
import { $selectMap } from './model'

export const tutorialMapList = createTutorial({
	steps: [
		{
			message: 'Чтобы создать карту воспользуйся мастером создания карты',
			title: 'Твои карты',
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
			// TODO добавить описание кодов блоков
			message: 'JSON редактор карты, структура простая ты разберешься',
			viewPosition: 'bottom',
			title: 'Редактор карты',
		},
		{
			element: () => document.querySelector('.json-map-editor .preview-map'),
			message: 'Тайловый радактор карты. Рисуй! Твори!',
			viewPosition: 'top',
			title: 'Редактор карты',
		},
		{
			element: () =>
				document.querySelector('.json-map-editor .type-cell-wrapper'),
			message:
				'Для рисования надо тыкнуть на нужный блок, невестись на карту справа нажать/зажать левую кнопку мышки',
			viewPosition: 'top-right',
			title: 'Редактор карты',
		},
		{
			element: () => document.querySelector('.json-map-editor .tile-map'),
			message:
				'Ты можешь уменьшать/увеличивать масштаб карты колёсиком мышки при нажатом ctrl. А также перемещать карту захватом мышки.',
			viewPosition: 'top-left',
			title: 'Редактор карты',
		},
		{
			element: () =>
				document.querySelector('.json-map-editor .list-spawner-wrapper'),
			message: 'И не забудь добавить места появления юнитов. Это очень важно!',
			viewPosition: 'top-right',
			title: 'Редактор карты',
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
