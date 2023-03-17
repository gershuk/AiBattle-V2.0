import { JSXInternal } from 'preact/src/jsx'
import { Button } from 'ui/button'
import { ComponentChild, createRef, RefObject, render } from 'preact'
import './styles.scss'
import { useState } from 'preact/hooks'
import { createTranslation } from 'libs'

const { getTranslationItem } = createTranslation({
	ru: {
		ok: 'Ок',
		cancel: 'Отмена',
	},
	en: {
		ok: 'Ok',
		cancel: 'Cancel',
	},
})

export const usePopup = () => {
	const [open, setOpen] = useState(false)
	const onOpen = () => setOpen(true)
	const onClose = () => setOpen(false)

	return { open, onOpen, onClose }
}

const createPopupContainer = () => {
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
		popupContainer,
	}
}

export const showPopup = ({
	content,
}: {
	content: (props: {
		htmlElement: HTMLDivElement | null
		close: () => void
		ok: () => void
		cancel: () => void
	}) => ComponentChild
}) => {
	return new Promise<{ status: 'ok' | 'cancel'; htmlElement: HTMLDivElement }>(
		resolve => {
			const { open, close } = createPopupContainer()
			const ref = createRef<HTMLDivElement>()

			open(
				<PopupBaseComponent htmlRef={ref}>
					{content({
						htmlElement: ref.current,
						close,
						ok: () => {
							resolve({ status: 'ok', htmlElement: ref.current! })
							close()
						},
						cancel: () => {
							resolve({ status: 'cancel', htmlElement: ref.current! })
							close()
						},
					})}
				</PopupBaseComponent>
			)
		}
	)
}

export const showConfirm = ({
	content,
	okButtonText = getTranslationItem('ok'),
	cancelButtonText = getTranslationItem('cancel'),
	okButtonClick,
	cancelButtonClick,
	title,
}: {
	content: JSXInternal.Element | string
	okButtonText?: string
	cancelButtonText?: string
	okButtonClick?: (data: { htmlElement: HTMLDivElement }) => boolean | void
	cancelButtonClick?: (data: { htmlElement: HTMLDivElement }) => boolean | void
	title?: string
}) => {
	return new Promise<{ status: 'ok' | 'cancel'; htmlElement: HTMLDivElement }>(
		resolve => {
			const { open, close } = createPopupContainer()
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
				<Popup
					htmlRef={ref}
					title={title}
					footerContent={
						<>
							<Button color="danger" onClick={cancelButtonClickHandler}>
								{cancelButtonText}
							</Button>
							<Button color="primary" onClick={okButtonClickHandler}>
								{okButtonText}
							</Button>
						</>
					}
				>
					<>{content}</>
				</Popup>
			)
		}
	)
}

export const showMessage = ({
	content,
	okButtonText = getTranslationItem('ok'),
	okButtonClick,
	title,
}: {
	content: JSXInternal.Element | string
	okButtonText?: string
	okButtonClick?: (data: { htmlElement: HTMLDivElement }) => boolean | void
	title?: string
}) => {
	return new Promise<{ status: 'ok' | 'cancel'; htmlElement: HTMLDivElement }>(
		resolve => {
			const { open, close } = createPopupContainer()
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
				<Popup
					htmlRef={ref}
					title={title}
					footerContent={
						<Button color="primary" onClick={okButtonClickHandler}>
							{okButtonText}
						</Button>
					}
				>
					<>{content}</>
				</Popup>
			)
		}
	)
}

export interface Popup {
	children: JSXInternal.Element
	htmlRef?: RefObject<HTMLDivElement>
	title?: string
	footerContent?: JSXInternal.Element
}

export const Popup = ({ children, htmlRef, title, footerContent }: Popup) => {
	return (
		<PopupBaseComponent htmlRef={htmlRef}>
			{title ? <div className={'popup-header'}>{title}</div> : null}
			<div className={'popup-content'}>{children}</div>
			{footerContent ? (
				<div className={'popup-footer'}>{footerContent}</div>
			) : null}
		</PopupBaseComponent>
	)
}

export interface PopupBaseComponent {
	children: ComponentChild
	htmlRef?: RefObject<HTMLDivElement>
}

export const PopupBaseComponent = ({
	children,
	htmlRef,
}: PopupBaseComponent) => {
	return (
		<div ref={htmlRef} className={'popup-overlay'}>
			<div className={'popup-body'}>{children}</div>
		</div>
	)
}
