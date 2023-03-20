import { createTranslation } from 'libs'

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

export const StartIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
			<path
				stroke="none"
				d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
			/>
		</svg>
	)
}

export const StopIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
			<rect width="256" height="256" fill="none" />
			<rect
				x="52"
				y="52"
				width="152"
				height="152"
				rx="6.9"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="24"
			/>
		</svg>
	)
}

export const PlusIcon = () => {
	return (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
		</svg>
	)
}

export const UndoIcon = () => {
	return (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
		</svg>
	)
}

export const RedoIcon = () => {
	return (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16a8.002 8.002 0 0 1 7.6-5.5c1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
		</svg>
	)
}

export const SaveIcon = () => {
	return (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
		</svg>
	)
}
