import './styles.scss'

interface ButtonProps {
	onClick?: () => void
	children: string | number
	className?: string
	color?: 'primary' | 'warning' | 'danger'
}

export const Button = ({
	onClick,
	children,
	className,
	color = 'primary',
}: ButtonProps) => {
	return (
		<button className={`button ${className ?? ''} ${color}`} onClick={onClick}>
			{children}
		</button>
	)
}
