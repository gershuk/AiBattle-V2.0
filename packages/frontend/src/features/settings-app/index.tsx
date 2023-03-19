import { useUnit } from 'effector-react'
import {
	$activeLanguage,
	changeLanguage,
	createTranslation,
	Languages,
} from 'libs'
import {
	$enableTutorials,
	resetAllTutorials,
	setEnableTutorials,
} from 'libs/tutorial'
import { historyMethods } from 'model'
import { Button, DropDown, Popup } from 'ui'
import './styles.scss'

const { useTranslation } = createTranslation({
	ru: {
		appSettings: 'Настройки приложения',
		tutorials: 'Туториал',
		language: 'Язык',
		ok: 'Ок',
		on: 'Вкл',
		off: 'Выкл',
		resetTutorial: 'Сбросить',
	},
	en: {
		appSettings: 'App settings',
		tutorials: 'Tutorial',
		language: 'Language',
		ok: 'Ok',
		on: 'On',
		off: 'Off',
		resetTutorial: 'Reset',
	},
})

export const SettingsApp = ({ onClose }: { onClose: () => void }) => {
	const t = useTranslation()
	const { activeLanguage, enableTutorials } = useUnit({
		activeLanguage: $activeLanguage,
		enableTutorials: $enableTutorials,
	})
	const options = Object.values(Languages).map(l => ({ id: l, text: l }))
	return (
		<Popup
			title={t('appSettings')}
			footerContent={
				<Button color="primary" onClick={onClose}>
					{t('ok')}
				</Button>
			}
		>
			<div className={'app-setting'}>
				<div className={'app-setting-item'}>
					<div>{t('language')}</div>
					<DropDown
						initValue={activeLanguage}
						options={options}
						onChange={id => changeLanguage(id as Languages)}
					/>
				</div>
				<div className={'app-setting-item'}>
					<div>{t('tutorials')}</div>
					<Button
						onClick={() => setEnableTutorials(false)}
						color={!enableTutorials ? 'primary' : undefined}
					>
						{t('off')}
					</Button>
					<Button
						onClick={() => setEnableTutorials(true)}
						color={enableTutorials ? 'primary' : undefined}
					>
						{t('on')}
					</Button>

					<Button
						onClick={() => {
							historyMethods.appendParams({ page: '' })
							setEnableTutorials(true)
							resetAllTutorials()
						}}
						className="app-setting-reset-tutorial"
						color="warning"
					>
						{t('resetTutorial')}
					</Button>
				</div>
			</div>
		</Popup>
	)
}
