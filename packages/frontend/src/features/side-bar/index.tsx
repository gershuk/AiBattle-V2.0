import { useUnit } from 'effector-react'
import { JSXInternal } from 'preact/src/jsx'
import { $locationSearch, historyMethods } from '../../model'
import './styles.scss'

//TODO: убрать захардкоженные свг
export const SideBar = () => {
	return (
		<div className={'side-bar'}>
			<Icon id={'controller-editor'} title={'редактор ии'}>
				<svg
					width="40px"
					height="40px"
					viewBox="0 0 24 24"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g
						id="production"
						stroke="none"
						stroke-width="1"
						fill="none"
						fill-rule="evenodd"
					>
						<g id="code" fill="#000000">
							<path
								d="M21.0037081,11.6568542 L15.3468538,17.3137085 L13.9326403,15.8994949 L18.175281,11.6568542 L13.9326403,7.41421356 L15.3468538,6 L21.0037081,11.6568542 Z M5.82842712,11.6568542 L10.0710678,15.8994949 L8.65685425,17.3137085 L3,11.6568542 L8.65685425,6 L10.0710678,7.41421356 L5.82842712,11.6568542 Z"
								id="Shape"
							></path>
						</g>
					</g>
				</svg>
			</Icon>
			<Icon id={'game'} title={'awesome игра'}>
				<svg
					width="30px"
					height="30px"
					viewBox="0 0 17 17"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g></g>
					<path
						d="M9 3.988v-2.988h-1v2.988c-3.564 0.105-8 1.282-8 2.487v7.041c0 0.827 0.673 1.5 1.5 1.5h1.79l1.996-3.931c0.567 0.104 1.713 0.274 3.173 0.274 1.479 0 2.694-0.174 3.288-0.277l1.908 3.934h1.845c0.827 0 1.5-0.673 1.5-1.5v-7.041c0-1.205-4.437-2.383-8-2.487zM16 13.516c0 0.275-0.225 0.5-0.5 0.5h-1.218l-1.976-4.070-0.386 0.085c-0.015 0.003-1.515 0.329-3.462 0.329-1.941 0-3.315-0.323-3.329-0.327l-0.384-0.093-2.068 4.075h-1.177c-0.275 0-0.5-0.225-0.5-0.5v-6.915c0.502-0.437 3.38-1.518 7-1.611v0.011h1v-0.013c3.619 0.094 6.498 1.175 7 1.612v6.917zM5 7.020h0.998v1h-0.998v1.020h-1v-1.020h-1v-1h1v-1.020h1v1.020zM12.5 9.020c0.827 0 1.5-0.673 1.5-1.5s-0.673-1.5-1.5-1.5-1.5 0.672-1.5 1.5 0.673 1.5 1.5 1.5zM12.5 7.020c0.275 0 0.5 0.225 0.5 0.5s-0.225 0.5-0.5 0.5-0.5-0.225-0.5-0.5 0.225-0.5 0.5-0.5z"
						fill="#000000"
					/>
				</svg>
			</Icon>
		</div>
	)
}

interface IconProps {
	id: string
	title: string
	children: JSXInternal.Element
}

const Icon = ({ children, id, title }: IconProps) => {
	const { page = '' } = useUnit($locationSearch)
	const active = page === id || (page === '' && id === 'controller-editor')
	return (
		<div
			onClick={() => historyMethods.appendParams({ page: id })}
			className={`side-bar-item ${active ? 'active' : ''}`}
			title={title}
		>
			{children}
		</div>
	)
}
