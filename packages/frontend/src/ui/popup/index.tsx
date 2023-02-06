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
}: {
	content: JSXInternal.Element
	okButtonText: string
	cancelButtonText: string
	okButtonClick?: (data: { htmlElement: HTMLDivElement }) => boolean | void
	cancelButtonClick?: (data: { htmlElement: HTMLDivElement }) => boolean | void
}) => {
	return new Promise<{ status: 'ok' | 'cancel'; htmlElement: HTMLDivElement }>(
		resolve => {
			const ref = createRef<HTMLDivElement>()
			const rootNode = document.querySelector('#popups')!

			const okButtonClickHandler = () => {
				if (okButtonClick?.({ htmlElement: ref.current! }) === false) return
				resolve({
					status: 'ok',
					htmlElement: ref.current!,
				})
				render(null, rootNode)
			}

			const cancelButtonClickHandler = () => {
				if (cancelButtonClick?.({ htmlElement: ref.current! }) === false) return
				resolve({
					status: 'cancel',
					htmlElement: ref.current!,
				})
				render(null, rootNode)
			}

			render(
				<PopupComponent
					okButtonText={okButtonText}
					cancelButtonText={cancelButtonText}
					okButtonClick={okButtonClickHandler}
					cancelButtonClick={cancelButtonClickHandler}
					htmlRef={ref}
				>
					{content}
				</PopupComponent>,
				rootNode
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
}

export const PopupComponent = ({
	children,
	okButtonText,
	cancelButtonText,
	okButtonClick,
	cancelButtonClick,
	htmlRef,
}: PopupComponentProps) => {
	return (
		<div ref={htmlRef} className={'popup-overlay'}>
			<div className={'popup-body'}>
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
