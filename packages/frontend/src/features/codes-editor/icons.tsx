//TODO: убрать захордкоженные свг

export const RemoveIcon = () => {
	return (
		<svg
			version="1.1"
			id="Layer_1"
			xmlns="http://www.w3.org/2000/svg"
			x="0px"
			y="0px"
			width="14px"
			height="14px"
			viewBox="0 0 50 50"
		>
			<title>Удалить файл</title>
			<g>
				<line
					fill="none"
					stroke="#000000"
					stroke-width="2"
					stroke-miterlimit="10"
					x1="18.947"
					y1="17.153"
					x2="45.045"
					y2="43.056"
				/>
			</g>
			<g>
				<line
					fill="none"
					stroke="#000000"
					stroke-width="2"
					stroke-miterlimit="10"
					x1="19.045"
					y1="43.153"
					x2="44.947"
					y2="17.056"
				/>
			</g>
		</svg>
	)
}

export const AddIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
		>
			<title>Добавить файл</title>
			<path style={{ opacity: 0.4 }} d="M16 9h-5V4H9v5H4v2h5v5h2v-5h5V9z" />
		</svg>
	)
}

export const UploadIcon = () => {
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
			<title>Загрузить файл</title>
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
