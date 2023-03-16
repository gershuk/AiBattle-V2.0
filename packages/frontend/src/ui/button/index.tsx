import { clsx } from 'libs'
import { JSXInternal } from 'preact/src/jsx'
import './styles.scss'

interface ButtonProps {
	onClick?: () => void
	children: string | number | JSXInternal.Element
	className?: string
	color?: 'primary' | 'warning' | 'danger'
	disabled?: boolean
	type?: 'button' | 'reset' | 'submit'
	[k: string]: any
}

export const Button = ({
	onClick,
	children,
	className,
	color,
	disabled,
	type = 'button',
	...props
}: ButtonProps) => {
	return (
		<button
			{...props}
			type={type}
			disabled={disabled}
			className={clsx('button', className, color, disabled ? 'disabled' : null)}
			onClick={disabled ? undefined : onClick}
		>
			{children}
		</button>
	)
}
