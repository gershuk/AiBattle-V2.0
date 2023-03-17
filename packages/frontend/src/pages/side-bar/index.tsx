import { useUnit } from 'effector-react'
import { JSXInternal } from 'preact/src/jsx'
import { pathIsActive, RoutesPath } from '../routing'
import { $locationSearch, historyMethods } from 'model'
import {
	$activeLanguage,
	changeLanguage,
	clsx,
	createTranslation,
	Languages,
} from 'libs'
import './styles.scss'
import { Button, DropDown, showPopup } from 'ui'
import { useEffect } from 'preact/hooks'
import { RefObject } from 'preact'
import {
	sideBarAppSettingRef,
	sideBarItemRef,
	sideBarRef,
	tutorial,
} from './tutorial'

const { useTranslation } = createTranslation({
	ru: {
		botCod: 'Код ИИ',
		maps: 'Карты',
		game: 'Игра',
		appSettings: 'Настройки приложения',
		language: 'Язык',
		ok: 'Ок',
	},
	en: {
		botCod: 'Bot codes',
		maps: 'Maps',
		game: 'Game',
		appSettings: 'App settings',
		language: 'Language',
		ok: 'Ok',
	},
})

export const SideBar = () => {
	const t = useTranslation()

	useEffect(() => {
		tutorial.start()
	}, [])

	return (
		<div className={'side-bar'} ref={sideBarRef}>
			<Icon
				routePath={'controller-editor'}
				title={t('botCod')}
				htmlRef={sideBarItemRef}
			>
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
				</svg>
			</Icon>
			<Icon routePath={'map-editor'} title={t('maps')}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
					<path d="M208.938,331.094l11.875,29.688c-11.5,4.594-22.969,8.094-34.156,10.438l-6.531-31.313 C189.5,337.938,199.188,334.969,208.938,331.094z M113.719,369.438c11.719,3.375,24.063,5.188,36.688,5.375l0.5-32 c-9.813-0.156-19.344-1.531-28.344-4.125L113.719,369.438z M365.688,313.594c9.219,1.813,18.219,4.969,26.75,9.375l14.688-28.438 c-11.25-5.781-23.094-9.938-35.25-12.313L365.688,313.594z M298.938,287.344l9.563,30.5c9.781-3.063,19.438-5,28.75-5.75 l-2.563-31.875C323,281.156,310.969,283.563,298.938,287.344z M247.563,311.406c-3.594,2.25-7.125,4.313-10.594,6.25l15.563,27.938 c3.906-2.188,7.906-4.5,11.906-7c5.5-3.406,10.875-6.438,16.156-9.125l-14.531-28.5C260.063,304.031,253.875,307.5,247.563,311.406z M336,112c0,13.063-3.125,25.438-8.688,36.313L256,288c0,0-71.875-140.844-72.156-141.438C178.813,136.125,176,124.375,176,112 c0-44.188,35.813-80,80-80S336,67.813,336,112z M304,112c0-26.5-21.5-48-48-48s-48,21.5-48,48s21.5,48,48,48S304,138.5,304,112z M416,192h-75.063l-16.344,32h68.344l34.531,103.625l-11.031,12.188c11.75,10.625,17.844,20.406,17.875,20.438l3.375-2.031 L467.594,448H44.375l32.063-96.094c1.125,0.781,2,1.531,3.25,2.313l17-27.063c-3.813-2.406-6.938-4.781-9.688-7L119.063,224h68.375 c-6.781-13.25-12.125-23.719-16.344-32H96L0,480h512L416,192z" />
				</svg>
			</Icon>
			<Icon routePath={'game'} title={t('game')}>
				<svg viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
					<path d="M9 3.988v-2.988h-1v2.988c-3.564 0.105-8 1.282-8 2.487v7.041c0 0.827 0.673 1.5 1.5 1.5h1.79l1.996-3.931c0.567 0.104 1.713 0.274 3.173 0.274 1.479 0 2.694-0.174 3.288-0.277l1.908 3.934h1.845c0.827 0 1.5-0.673 1.5-1.5v-7.041c0-1.205-4.437-2.383-8-2.487zM16 13.516c0 0.275-0.225 0.5-0.5 0.5h-1.218l-1.976-4.070-0.386 0.085c-0.015 0.003-1.515 0.329-3.462 0.329-1.941 0-3.315-0.323-3.329-0.327l-0.384-0.093-2.068 4.075h-1.177c-0.275 0-0.5-0.225-0.5-0.5v-6.915c0.502-0.437 3.38-1.518 7-1.611v0.011h1v-0.013c3.619 0.094 6.498 1.175 7 1.612v6.917zM5 7.020h0.998v1h-0.998v1.020h-1v-1.020h-1v-1h1v-1.020h1v1.020zM12.5 9.020c0.827 0 1.5-0.673 1.5-1.5s-0.673-1.5-1.5-1.5-1.5 0.672-1.5 1.5 0.673 1.5 1.5 1.5zM12.5 7.020c0.275 0 0.5 0.225 0.5 0.5s-0.225 0.5-0.5 0.5-0.5-0.225-0.5-0.5 0.225-0.5 0.5-0.5z" />
				</svg>
			</Icon>
			{/* <Icon routePath={'replay'} title={'Просмотр реплеев'}>
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z" />
					</svg>
				</Icon> */}
			<div
				onClick={() =>
					showPopup({ content: props => <SettingsApp {...props} /> })
				}
				className={clsx('side-bar-item', 'app-settings')}
				title={t('appSettings')}
				ref={sideBarAppSettingRef}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="#000000"
					height="25px"
					width="25px"
					version="1.1"
					viewBox="0 0 54 54"
				>
					<g>
						<path d="M51.22,21h-5.052c-0.812,0-1.481-0.447-1.792-1.197s-0.153-1.54,0.42-2.114l3.572-3.571   c0.525-0.525,0.814-1.224,0.814-1.966c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.05-2.881-1.052-3.933,0l-3.571,3.571   c-0.574,0.573-1.366,0.733-2.114,0.421C33.447,9.313,33,8.644,33,7.832V2.78C33,1.247,31.753,0,30.22,0H23.78   C22.247,0,21,1.247,21,2.78v5.052c0,0.812-0.447,1.481-1.197,1.792c-0.748,0.313-1.54,0.152-2.114-0.421l-3.571-3.571   c-1.052-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l3.572,3.571   c0.573,0.574,0.73,1.364,0.42,2.114S8.644,21,7.832,21H2.78C1.247,21,0,22.247,0,23.78v6.439C0,31.753,1.247,33,2.78,33h5.052   c0.812,0,1.481,0.447,1.792,1.197s0.153,1.54-0.42,2.114l-3.572,3.571c-0.525,0.525-0.814,1.224-0.814,1.966   c0,0.743,0.289,1.441,0.814,1.967l4.553,4.553c1.051,1.051,2.881,1.053,3.933,0l3.571-3.572c0.574-0.573,1.363-0.731,2.114-0.42   c0.75,0.311,1.197,0.98,1.197,1.792v5.052c0,1.533,1.247,2.78,2.78,2.78h6.439c1.533,0,2.78-1.247,2.78-2.78v-5.052   c0-0.812,0.447-1.481,1.197-1.792c0.751-0.312,1.54-0.153,2.114,0.42l3.571,3.572c1.052,1.052,2.883,1.05,3.933,0l4.553-4.553   c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-3.572-3.571c-0.573-0.574-0.73-1.364-0.42-2.114   S45.356,33,46.168,33h5.052c1.533,0,2.78-1.247,2.78-2.78V23.78C54,22.247,52.753,21,51.22,21z M52,30.22   C52,30.65,51.65,31,51.22,31h-5.052c-1.624,0-3.019,0.932-3.64,2.432c-0.622,1.5-0.295,3.146,0.854,4.294l3.572,3.571   c0.305,0.305,0.305,0.8,0,1.104l-4.553,4.553c-0.304,0.304-0.799,0.306-1.104,0l-3.571-3.572c-1.149-1.149-2.794-1.474-4.294-0.854   c-1.5,0.621-2.432,2.016-2.432,3.64v5.052C31,51.65,30.65,52,30.22,52H23.78C23.35,52,23,51.65,23,51.22v-5.052   c0-1.624-0.932-3.019-2.432-3.64c-0.503-0.209-1.021-0.311-1.533-0.311c-1.014,0-1.997,0.4-2.761,1.164l-3.571,3.572   c-0.306,0.306-0.801,0.304-1.104,0l-4.553-4.553c-0.305-0.305-0.305-0.8,0-1.104l3.572-3.571c1.148-1.148,1.476-2.794,0.854-4.294   C10.851,31.932,9.456,31,7.832,31H2.78C2.35,31,2,30.65,2,30.22V23.78C2,23.35,2.35,23,2.78,23h5.052   c1.624,0,3.019-0.932,3.64-2.432c0.622-1.5,0.295-3.146-0.854-4.294l-3.572-3.571c-0.305-0.305-0.305-0.8,0-1.104l4.553-4.553   c0.304-0.305,0.799-0.305,1.104,0l3.571,3.571c1.147,1.147,2.792,1.476,4.294,0.854C22.068,10.851,23,9.456,23,7.832V2.78   C23,2.35,23.35,2,23.78,2h6.439C30.65,2,31,2.35,31,2.78v5.052c0,1.624,0.932,3.019,2.432,3.64   c1.502,0.622,3.146,0.294,4.294-0.854l3.571-3.571c0.306-0.305,0.801-0.305,1.104,0l4.553,4.553c0.305,0.305,0.305,0.8,0,1.104   l-3.572,3.571c-1.148,1.148-1.476,2.794-0.854,4.294c0.621,1.5,2.016,2.432,3.64,2.432h5.052C51.65,23,52,23.35,52,23.78V30.22z" />
						<path d="M27,18c-4.963,0-9,4.037-9,9s4.037,9,9,9s9-4.037,9-9S31.963,18,27,18z M27,34c-3.859,0-7-3.141-7-7s3.141-7,7-7   s7,3.141,7,7S30.859,34,27,34z" />
					</g>
				</svg>
			</div>
		</div>
	)
}

interface IconProps {
	routePath: RoutesPath
	title: string
	children: JSXInternal.Element
	htmlRef?: RefObject<HTMLDivElement>
	[k: string]: any
}

const Icon = ({ children, routePath, title, htmlRef, ...props }: IconProps) => {
	const { page: currentPath = '' } = useUnit($locationSearch)
	const active = pathIsActive(routePath, currentPath)
	return (
		<div
			onClick={() =>
				historyMethods.appendParams({ page: active ? '' : routePath })
			}
			className={clsx('side-bar-item', active ? 'active' : null)}
			title={title}
			ref={htmlRef}
			{...props}
		>
			<div className={'side-bar-item-icon'}>{children}</div>
			{title ? <div className={'side-bar-item-title'}>{title}</div> : null}
		</div>
	)
}

const SettingsApp = ({ close }: { close: () => void }) => {
	const t = useTranslation()
	const activeLanguage = useUnit($activeLanguage)
	const options = Object.values(Languages).map(l => ({ id: l, text: l }))
	return (
		<div className={'app-setting-wrapper'}>
			<div className={'popup-header'}>{t('appSettings')}</div>
			<div className={'popup-content app-setting-content'}>
				<div className={'app-setting-item'}>
					<div>{t('language')}</div>
					<DropDown
						initValue={activeLanguage}
						options={options}
						onChange={id => changeLanguage(id as Languages)}
					/>
				</div>
			</div>
			<div className={'popup-footer'}>
				<Button color="primary" onClick={close}>
					{t('ok')}
				</Button>
			</div>
		</div>
	)
}
