import { sample } from 'effector'
import { createTranslation } from 'libs'
import { createTutorial } from 'libs/tutorial'
import { createTutorialPanel } from 'ui'
import { $selectCode } from './model'

const { getTranslationItem } = createTranslation({
	ru: {
		scripts: 'Твои скрипты',
		addScript:
			'Слева ты видишь список скриптов, наверное он пустой, давай создадим новый скрипт.',
		clickAdd:
			'Нажми на плюсик, чтобы создать новый скрипт для бота. <b>Создастся пример бота.</b>',
		clickUpload:
			'Но если вдруг захочешь, ты можешь загрузить свой с компьютера',
		editBot: 'Редактор бота',
		infoEditBot: `
		Контроллер должен возвращать код действия.
		<div>
			Метод <b>GetCommand</b> получает всю необходимую тебе информацию. 
			Пользуйся браузерными инструментами разработки, чтобы логировать информацию. 
		</div>
		<div style="margin-top: 8px;">
			Назначение кодов:
		</div>
		<div style="padding-left: 8px;">
			<div>0 - ничего</div>
			<div>1 - походить вниз</div>
			<div>2 - походить право</div>
			<div>3 - походить верх</div>
			<div>4 - походить лево</div>
			<div>5 - поставить бомбу</div>
		</div>
	`,
		debug:
			'Внизу панель для быстрого запуска бота. Выбери карту и нажми на кнопку старта.',
	},
	en: {
		scripts: 'Your scripts',
		addScript: `On the left you see a list of scripts, it's probably empty, let's create a new script.`,
		clickAdd:
			'Click on the plus sign to create a new bot script. <b>An example bot will be created.</b>',
		clickUpload: 'But if you want, you can download yours from your computer',
		editBot: 'Bot Editor',
		infoEditBot: `
		The controller must return an action code.
		<div>
			The <b>GetCommand</b> method gets all the information you need.
			Use browser-based development tools to log information.
		</div>
		<div style="margin-top: 8px;">
			Purpose of codes:
		</div>
		<div style="padding-left: 8px;">
			<div>0 - nothing</div>
			<div>1 - down</div>
			<div>2 - right</div>
			<div>3 - top</div>
			<div>4 - left</div>
			<div>5 - plant the bomb</div>
		</div>
		`,
		debug:
			'At the bottom of the panel for quick launch of the bot. Select a map and press the start button.',
	},
})

export const tutorialCodeList = createTutorial({
	steps: [
		{
			message: () => getTranslationItem('addScript'),
			title: () => getTranslationItem('scripts'),
			element: () => document.querySelector('.controller-editor .code-loader'),
			viewPosition: 'right',
		},
		{
			element: () => document.querySelector('.controller-editor .add-code'),
			message: () => getTranslationItem('clickAdd'),
			viewPosition: 'bottom-right',
			title: () => getTranslationItem('scripts'),
		},
		{
			element: () => document.querySelector('.controller-editor .upload-code'),
			message: () => getTranslationItem('clickUpload'),
			viewPosition: 'bottom-right',
			title: () => getTranslationItem('scripts'),
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
			message: () => getTranslationItem('infoEditBot'),
			viewPosition: 'bottom',
			title: () => getTranslationItem('editBot'),
		},
		{
			element: () => document.querySelector('.debug-wrapper'),
			message: () => getTranslationItem('debug'),
			viewPosition: 'top',
			title: () => getTranslationItem('editBot'),
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
