import { createEvent, sample } from 'effector'
import { createTutorial } from 'libs/tutorial'
import { readCodesFromLocalStorageFx, readMapsFromLocalStorageFx } from 'model'
import { RoutesView, SideBar } from 'pages'
import { createTutorialPanel } from 'ui'
import './styles.scss'

export const App = () => {
	return (
		<div className={'app'}>
			<SideBar />
			<div className={'content'}>
				<RoutesView />
			</div>
		</div>
	)
}

readCodesFromLocalStorageFx()
readMapsFromLocalStorageFx()

const tutorial = createTutorial({
	steps: [
		{
			message:
				'Начнем наше увлекательнейшей приключение по написанию самого лучшего в мире игрового ИИ!',
			title: 'Привет!',
		},
		{
			element: () => document.querySelector('.side-bar'),
			message: 'Это сайдбар, тут вкладки прям как в vs code!',
			viewPosition: 'right',
			title: 'Сайдбар',
		},
		{
			element: () => document.querySelector('.side-bar-item')!,
			message:
				'Например нажав на вкадку "Код ИИ" ты окажешься в святая святых этого приложения. Будешь писать код для ботов и устраивать паломничества на <a href="https://learn.javascript.ru/">learn.javascript</a>.',
			viewPosition: 'bottom-right',
			title: 'Сайдбар',
		},
		{
			element: () => document.querySelector('.side-bar-item.app-settings')!,
			message:
				'Внизу ты найдешь настройки приложения. Там мало пунктов, но вдруг ты захочешь сменить язык?',
			viewPosition: 'top-right',
			title: 'Сайдбар',
		},
	],
	delayStart: 1000,
	view: createTutorialPanel,
	id: 'side-bar-tutorial',
})

tutorial.show()
