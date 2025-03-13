import styles from './Button.module.scss';

type Props = {
	label: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	type?: 'button' | 'submit';
	style?: React.CSSProperties;
};

const Button = ({ label, onClick, type = 'button', style }: Props) => {
	return (
		<button className={styles.button} onClick={onClick} type={type} style={style}>
			{label}
		</button>
	);
};

export default Button;
