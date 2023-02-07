import { JSXInternal } from 'preact/src/jsx'
import { Button } from 'ui/button'
import { createRef, RefObject, render } from 'preact'
import './styles.scss'

export const showPopup = ({
	content,
	okButtonText,
	cancelButtonText,
	okButtonClick,
	cancelButtonClick,
	title,
}: {
	content: JSXInternal.Element
	okButtonText: string
	cancelButtonText: string
	okButtonClick?: (data: { htmlElement: HTMLDivElement }) => boolean | void
	cancelButtonClick?: (data: { htmlElement: HTMLDivElement }) => boolean | void
	title?: string
}) => {
	return new Promise<{ status: 'ok' | 'cancel'; htmlElement: HTMLDivElement }>(
		resolve => {
			const rootNode = document.querySelector('#popups')!
			const popupContainer = document.createElement('div')
			rootNode.appendChild(popupContainer)

			const ref = createRef<HTMLDivElement>()

			const closePopup = () => {
				render(null, popupContainer)
				popupContainer.remove()
			}

			const okButtonClickHandler = () => {
				if (okButtonClick?.({ htmlElement: ref.current! }) === false) return
				resolve({
					status: 'ok',
					htmlElement: ref.current!,
				})
				closePopup()
			}

			const cancelButtonClickHandler = () => {
				if (cancelButtonClick?.({ htmlElement: ref.current! }) === false) return
				resolve({
					status: 'cancel',
					htmlElement: ref.current!,
				})
				closePopup()
			}

			render(
				<PopupComponent
					okButtonText={okButtonText}
					cancelButtonText={cancelButtonText}
					okButtonClick={okButtonClickHandler}
					cancelButtonClick={cancelButtonClickHandler}
					htmlRef={ref}
					title={title}
				>
					{content}
				</PopupComponent>,
				popupContainer
			)
		}
	)
}

export interface PopupComponentProps {
	children: JSXInternal.Element
	okButtonText: string
	cancelButtonText: string
	okButtonClick: () => void
	cancelButtonClick: () => void
	htmlRef?: RefObject<HTMLDivElement>
	title?: string
}

export const PopupComponent = ({
	children,
	okButtonText,
	cancelButtonText,
	okButtonClick,
	cancelButtonClick,
	htmlRef,
	title,
}: PopupComponentProps) => {
	return (
		<div ref={htmlRef} className={'popup-overlay'}>
			<div className={'popup-body'}>
				{title ? <div className={'popup-header'}>{title}</div> : null}
				<div className={'popup-content'}>{children}</div>
				<div className={'popup-footer'}>
					<Button color="danger" onClick={cancelButtonClick}>
						{cancelButtonText}
					</Button>
					<Button onClick={okButtonClick}>{okButtonText}</Button>
				</div>
			</div>
		</div>
	)
}
