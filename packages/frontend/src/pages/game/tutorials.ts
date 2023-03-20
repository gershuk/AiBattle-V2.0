import { sample } from 'effector'
import { $activeGame } from 'features/game-controller'
import { createTutorial } from 'libs/tutorial'
import { createTutorialPanel } from 'ui'

export const tutorialGameSetting = createTutorial({
	steps: [
		{
			message: 'Здесь ты конфигурируешь игру',
			title: 'Запуск игры',
		},
		{
			message:
				'Как выберешь карту и настроишь ботов кнопка старта активируется',
			title: 'Запуск игры',
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
			message:
				'Ты можешь запустить автоматическую игру ботов или же контролировать каждый их ход',
			title: 'Запуск игры',
			element: () => document.querySelector('.game-controller-footer'),
			viewPosition: 'top-right',
		},
		{
			message:
				'Ты можешь уменьшать/увеличивать масштаб игры колёсиком мышки при нажатом ctrl. А также перемещать карту захватом мышки.',
			title: 'Удобства',
			element: () => document.querySelector('.awesome-canvas-game canvas'),
			viewPosition: 'top-right',
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
