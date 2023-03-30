import { createEvent, sample } from 'effector'
import { createTranslation } from 'libs'
import { createTutorial, resetAllTutorials } from 'libs/tutorial'
import { createRef } from 'preact'
import { createTutorialPanel } from 'ui'

const sideBarRef = createRef<HTMLDivElement>()
const sideBarItemRef = createRef<HTMLDivElement>()
const sideBarAppSettingRef = createRef<HTMLDivElement>()

const { getTranslationItem } = createTranslation({
	ru: {
		hello: 'Привет!',
		helloMsg:
			'Начнем наше увлекательнейшее приключение по созданию самого лучшего в мире игрового ИИ!',
		sideBar: 'Сайдбар',
		sideBarMsg: 'Это сайдбар, тут табы прям как в vs code!',
		codeWrite:
			'Например, нажав на вкладку "Код ИИ" ты окажешься в самом важном месте этого приложения. Тут будешь писать код для ботов на языке <a href="https://learn.javascript.ru/">javascript</a>.',
		appSetting:
			'Внизу ты найдешь настройки приложения. Там мало пунктов, но вдруг ты захочешь сменить язык или отключить помощника?',
	},
	en: {
		hello: 'Hi!',
		helloMsg: `Let's begin our exciting adventure of creating the world's best game AI!`,
		sideBar: 'Sidebar',
		sideBarMsg: 'This is a sidebar, it has tabs just like in vs code!',
		codeWrite: 'For example, select the "AI Code" tab to write code for bots.',
		appSetting:
			'At the bottom you will find the application settings. There are few items, but what if you want to change the language or turn off the assistant?',
	},
})

const tutorial = createTutorial({
	steps: [
		{
			message: () => getTranslationItem('helloMsg'),
			title: () => getTranslationItem('hello'),
		},
		{
			element: () => sideBarRef.current,
			message: () => getTranslationItem('sideBarMsg'),
			viewPosition: 'right',
			title: () => getTranslationItem('sideBar'),
		},
		{
			element: () => sideBarItemRef.current,
			message: () => getTranslationItem('codeWrite'),
			viewPosition: 'bottom-right',
			title: () => getTranslationItem('sideBar'),
		},
		{
			element: () => sideBarAppSettingRef.current,
			message: () => getTranslationItem('appSetting'),
			viewPosition: 'top-right',
			title: () => getTranslationItem('sideBar'),
		},
	],
	delayStart: 500,
	view: createTutorialPanel,
	id: 'side-bar-tutorial',
})

const playTutorial = createEvent()

sample({
	clock: [playTutorial, resetAllTutorials],
	target: tutorial.start,
})

export { sideBarRef, sideBarItemRef, sideBarAppSettingRef, playTutorial }
