import { createTranslation } from 'libs'
import { LinkButton } from 'ui'
import './styles.scss'

const { useTranslation } = createTranslation({
	ru: {
		title: 'Присылай обратную связь, ишью и пр-ы.',
		project: 'Наш проект на github.com',
	},
	en: {
		title: 'Send feedback, issue and pull requests.',
		project: 'Our project on github.com',
	},
})

export const OtherwisePage = () => {
	const t = useTranslation()
	return (
		<div className={'otherwise-page'}>
			<div className={'logo-wrapper'}>
				<img alt="logo" src="./logo.png" />
			</div>
			<div>{t('title')}</div>
			<div>
				<LinkButton
					onClick={() =>
						window.open('https://github.com/gershuk/AiBattle-V2.0', '_blank')
					}
				>
					{t('project')}
				</LinkButton>
			</div>
		</div>
	)
}
