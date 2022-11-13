import './styles.scss'

interface ButtonProps {
	onClick?: () => void
	children: string | number
	className?: string
	color?: 'primary' | 'warning' | 'danger'
	[k: string]: any
}

export const Button = ({
	onClick,
	children,
	className,
	color = 'primary',
	...props
}: ButtonProps) => {
	return (
		<button
			{...props}
			className={`button ${className ?? ''} ${color}`}
			onClick={onClick}
		>
			{children}
		</button>
	)
}
