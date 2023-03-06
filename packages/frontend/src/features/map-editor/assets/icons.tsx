import { createTranslation } from "libs"

const { useTranslation } = createTranslation({
	ru: {
		addFile: 'Добавить файл',
		uploadFile: 'Загрузить файл',
	},
	en: {
		addFile: 'Add file',
		uploadFile: 'Upload file',
	},
})

export const AddIcon = () => {
	const t = useTranslation()
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
		>
			<title>{t('addFile')}</title>
			<path style={{ opacity: 0.4 }} d="M16 9h-5V4H9v5H4v2h5v5h2v-5h5V9z" />
		</svg>
	)
}

export const UploadIcon = () => {
	const t = useTranslation()
	return (
		<svg
			aria-describedby="desc"
			aria-labelledby="title"
			role="img"
			width="15"
			height="15"
			viewBox="0 0 64 64"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<title>{t('uploadFile')}</title>
			<path
				d="M31 48V3M16 20L31 3l15 16"
				data-name="layer2"
				fill="none"
				stroke="#202020"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				strokeWidth={2}
			/>
			<path
				d="M8 46v16h46V46"
				data-name="layer1"
				fill="none"
				stroke="#202020"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="10"
				strokeWidth={2}
			/>
		</svg>
	)
}
