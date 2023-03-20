import { sample } from 'effector'
import { createTranslation } from 'libs'
import { createTutorial } from 'libs/tutorial'
import { createTutorialPanel } from 'ui'
import { $selectCode } from './model'

const {} = createTranslation({
	ru: {},
	en: {},
})

export const tutorialCodeList = createTutorial({
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
			message: `
					Бот представляет из себя контроллер, который должен возвращать код действия.
					<div>
						Метод <b>GetCommand</b> получает всю необходимую тебе информацию. 
						Пользуйся браузерными инструментами разработки, чтобы логировать информацию. 
					</div>
					<div style="margin-top: 8px;">
						Назначение кодов:
					</div>
					<div style="padding-left: 8px;">
						<div>0 - ничего</div>
						<div>1 - вниз</div>
						<div>2 - право</div>
						<div>3 - верх</div>
						<div>4 - лево</div>
						<div>5 - бомба</div>
					</div>
				`,
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
