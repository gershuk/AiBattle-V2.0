import { clsx } from 'libs'
import './styles.scss'

interface ButtonProps {
	onClick?: () => void
	children: string | number
	className?: string
	color?: 'primary' | 'warning' | 'danger'
	disabled?: boolean
	[k: string]: any
}

export const Button = ({
	onClick,
	children,
	className,
	color = 'primary',
	disabled,
	...props
}: ButtonProps) => {
	return (
		<button
			{...props}
			disabled={disabled}
			className={clsx('button', className, color, disabled ? 'disabled' : null)}
			onClick={disabled ? undefined : onClick}
		>
			{children}
		</button>
	)
}
