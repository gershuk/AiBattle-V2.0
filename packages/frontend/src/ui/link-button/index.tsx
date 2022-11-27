import { clsx } from 'libs'
import './styles.scss'

interface LinkButtonProps {
	onClick?: () => void
	children: string | number
	className?: string
	disabled?: boolean
	color?: 'primary' | 'warning' | 'danger'
	type?: 'button' | 'reset' | 'submit'
	[k: string]: any
}

export const LinkButton = ({
	onClick,
	children,
	className,
	disabled,
	color = 'primary',
	type = 'button',
	...props
}: LinkButtonProps) => {
	return (
		<button
			{...props}
			type={type}
			disabled={disabled}
			className={clsx(
				'link-button',
				color,
				className,
				disabled ? 'disabled' : null
			)}
			onClick={disabled ? undefined : onClick}
		>
			{children}
		</button>
	)
}
