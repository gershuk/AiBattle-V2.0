import { JSXInternal } from 'preact/src/jsx'
import { Button } from 'ui/button'
import { createRef, RefObject, render } from 'preact'
import './styles.scss'

const createPopup = () => {
	const rootNode = document.querySelector('#popups')!
	const popupContainer = document.createElement('div')
	rootNode.appendChild(popupContainer)
	return {
		open: (element: JSXInternal.Element) => {
			render(element, popupContainer)
		},
		close: () => {
			render(null, popupContainer)
			popupContainer.remove()
		},
	}
}

export const showConfirm = ({
	content,
	okButtonText,
	cancelButtonText,
	okButtonClick,
	cancelButtonClick,
	title,
}: {
	content: JSXInternal.Element | string
	okButtonText: string
	cancelButtonText: string
	okButtonClick?: (data: { htmlElement: HTMLDivElement }) => boolean | void
	cancelButtonClick?: (data: { htmlElement: HTMLDivElement }) => boolean | void
	title?: string
}) => {
	return new Promise<{ status: 'ok' | 'cancel'; htmlElement: HTMLDivElement }>(
		resolve => {
			const { open, close } = createPopup()
			const ref = createRef<HTMLDivElement>()

			const okButtonClickHandler = () => {
				if (okButtonClick?.({ htmlElement: ref.current! }) === false) return
				resolve({
					status: 'ok',
					htmlElement: ref.current!,
				})
				close()
			}

			const cancelButtonClickHandler = () => {
				if (cancelButtonClick?.({ htmlElement: ref.current! }) === false) return
				resolve({
					status: 'cancel',
					htmlElement: ref.current!,
				})
				close()
			}

			open(
				<PopupComponent
					htmlRef={ref}
					title={title}
					footerContent={
						<>
							<Button color="danger" onClick={cancelButtonClickHandler}>
								{cancelButtonText}
							</Button>
							<Button onClick={okButtonClickHandler}>{okButtonText}</Button>
						</>
					}
				>
					<>{content}</>
				</PopupComponent>
			)
		}
	)
}

export const showMessage = ({
	content,
	okButtonText,
	okButtonClick,
	title,
}: {
	content: JSXInternal.Element | string
	okButtonText: string
	okButtonClick?: (data: { htmlElement: HTMLDivElement }) => boolean | void
	title?: string
}) => {
	return new Promise<{ status: 'ok' | 'cancel'; htmlElement: HTMLDivElement }>(
		resolve => {
			const { open, close } = createPopup()
			const ref = createRef<HTMLDivElement>()

			const okButtonClickHandler = () => {
				if (okButtonClick?.({ htmlElement: ref.current! }) === false) return
				resolve({
					status: 'ok',
					htmlElement: ref.current!,
				})
				close()
			}

			open(
				<PopupComponent
					htmlRef={ref}
					title={title}
					footerContent={
						<Button onClick={okButtonClickHandler}>{okButtonText}</Button>
					}
				>
					<>{content}</>
				</PopupComponent>
			)
		}
	)
}

export interface PopupComponentProps {
	children: JSXInternal.Element
	htmlRef?: RefObject<HTMLDivElement>
	title?: string
	footerContent?: JSXInternal.Element
}

export const PopupComponent = ({
	children,
	htmlRef,
	title,
	footerContent,
}: PopupComponentProps) => {
	return (
		<div ref={htmlRef} className={'popup-overlay'}>
			<div className={'popup-body'}>
				{title ? <div className={'popup-header'}>{title}</div> : null}
				<div className={'popup-content'}>{children}</div>
				{footerContent ? (
					<div className={'popup-footer'}>{footerContent}</div>
				) : null}
			</div>
		</div>
	)
}
