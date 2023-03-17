import { createTutorial } from 'libs/tutorial'
import { createRef } from 'preact'
import { createTutorialPanel } from 'ui'

const sideBarRef = createRef<HTMLDivElement>()
const sideBarItemRef = createRef<HTMLDivElement>()
const sideBarAppSettingRef = createRef<HTMLDivElement>()

const tutorial = createTutorial({
	steps: [
		{
			message:
				'Начнем наше увлекательнейшей приключение по написанию самого лучшего в мире игрового ИИ!',
			title: 'Привет!',
		},
		{
			element: () => sideBarRef.current,
			message: 'Это сайдбар, тут вкладки прям как в vs code!',
			viewPosition: 'right',
			title: 'Сайдбар',
		},
		{
			element: () => sideBarItemRef.current,
			message:
				'Например нажав на вкадку "Код ИИ" ты окажешься в святая святых этого приложения. Будешь писать код для ботов и устраивать паломничества на <a href="https://learn.javascript.ru/">learn.javascript</a>.',
			viewPosition: 'bottom-right',
			title: 'Сайдбар',
		},
		{
			element: () => sideBarAppSettingRef.current,
			message:
				'Внизу ты найдешь настройки приложения. Там мало пунктов, но вдруг ты захочешь сменить язык?',
			viewPosition: 'top-right',
			title: 'Сайдбар',
		},
	],
	delayStart: 500,
	view: createTutorialPanel,
	id: 'side-bar-tutorial',
})

export { sideBarRef, sideBarItemRef, sideBarAppSettingRef, tutorial }
