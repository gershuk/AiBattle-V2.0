import { sample } from 'effector'
import { $activeGame } from 'features/game-controller'
import { createTranslation } from 'libs'
import { createTutorial } from 'libs/tutorial'
import { createTutorialPanel } from 'ui'

const { getTranslationItem } = createTranslation({
	ru: {
		startGame: 'Запуск игры',
		configGame: 'Здесь ты конфигурируешь игру',
		activeStart:
			'Как выберешь карту и настроишь ботов кнопка старта активируется',
		startInfo:
			'Ты можешь запустить автоматическую игру ботов или же контролировать каждый их ход',
		zoom: 'Ты можешь уменьшать/увеличивать масштаб игры колёсиком мышки при нажатом ctrl. А также перемещать карту захватом мышки.',
		facilities: 'Удобства',
	},
	en: {
		startGame: 'Game start',
		configGame: 'Here you configure the game',
		activeStart:
			'When you select a map and set up bots, the start button is activated',
		startInfo:
			'You can start the bots to play automatically or control their every move',
		zoom: 'You can zoom in/zoom out of the game with the mouse wheel while pressing ctrl. You can also move the map with the mouse.',
		facilities: 'Facilities',
	},
})

export const tutorialGameSetting = createTutorial({
	steps: [
		{
			message: () => getTranslationItem('configGame'),
			title: () => getTranslationItem('startGame'),
		},
		{
			message: () => getTranslationItem('activeStart'),
			title: () => getTranslationItem('startGame'),
			element: () =>
				document.querySelector(
					'.game-controller .game-controller-footer .btn-toggle-game'
				),
			viewPosition: 'top-right',
		},
	],
	delayStart: 500,
	view: createTutorialPanel,
	id: 'settings-game-tutorial',
})

export const tutorialGameStart = createTutorial({
	steps: [
		{
			message: () => getTranslationItem('startInfo'),
			title: () => getTranslationItem('startGame'),
			element: () => document.querySelector('.game-controller-footer'),
			viewPosition: 'top-right',
		},
		{
			message: () => getTranslationItem('zoom'),
			title: () => getTranslationItem('facilities'),
			element: () => document.querySelector('.awesome-canvas-game canvas'),
			viewPosition: 'left',
		},
	],
	delayStart: 100,
	view: createTutorialPanel,
	id: 'start-game-tutorial',
})

sample({
	clock: $activeGame,
	filter: activeGame => activeGame,
	target: tutorialGameStart.start,
})
