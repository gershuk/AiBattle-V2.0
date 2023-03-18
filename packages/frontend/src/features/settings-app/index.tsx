import { useUnit } from 'effector-react'
import {
	$activeLanguage,
	changeLanguage,
	createTranslation,
	Languages,
} from 'libs'
import { Button, DropDown, Popup } from 'ui'

const { useTranslation } = createTranslation({
	ru: {
		appSettings: 'Настройки приложения',
		language: 'Язык',
		ok: 'Ок',
	},
	en: {
		appSettings: 'App settings',
		language: 'Language',
		ok: 'Ok',
	},
})

export const SettingsApp = ({ onClose }: { onClose: () => void }) => {
	const t = useTranslation()
	const activeLanguage = useUnit($activeLanguage)
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
			<div className={'app-setting-item'}>
				<div>{t('language')}</div>
				<DropDown
					initValue={activeLanguage}
					options={options}
					onChange={id => changeLanguage(id as Languages)}
				/>
			</div>
		</Popup>
	)
}
