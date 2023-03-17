import { sample } from 'effector'
import { createTutorial } from 'libs/tutorial'
import { createRef } from 'preact'
import { createTutorialPanel } from 'ui'
import { $selectCode } from './model'

export const tutorialList = createTutorial({
	steps: [
		{
			message:
				'Слева ты видишь список скриптов, наверное он пустой, давай создадим новый скрипт.',
			title: 'Твои скрипты',
			element: () => document.querySelector('.controller-editor .code-loader'),
			viewPosition: 'right',
		},
		{
			element: () => document.querySelector('.controller-editor .add-code'),
			message:
				'Нажми на плюсик, чтобы создать новый скрипт для бота. <b>Создастся пример бота.</b>',
			viewPosition: 'bottom-right',
			title: 'Твои скрипты',
		},
		{
			element: () => document.querySelector('.controller-editor .upload-code'),
			message: 'Но если вдруг захочешь, ты можешь загрузить свой с компьютера',
			viewPosition: 'bottom-right',
			title: 'Твои скрипты',
		},
	],
	delayStart: 500,
	view: createTutorialPanel,
	id: 'code-list-tutorial',
})

export const tutorialEditor = createTutorial({
	steps: [
		{
			element: () => document.querySelector('.code-editor'),
			message:
				'Сверху редактор кода. Бот представляет из себя контроллер, который должен возвращать код действия.',
			viewPosition: 'bottom',
			title: 'Редактор бота',
		},
		{
			element: () => document.querySelector('.debug-wrapper'),
			message:
				'Внизу простой дебаг, чтобы ты мог запускать бота в игру быстро.',
			viewPosition: 'top',
			title: 'Редактор бота',
		},
	],
	delayStart: 500,
	view: createTutorialPanel,
	id: 'editor-bot-tutorial',
})

sample({
	clock: $selectCode,
	filter: Boolean,
	target: tutorialEditor.start,
})
