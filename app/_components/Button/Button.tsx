import styles from './Button.module.scss';

type Props = {
	label: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	type?: 'button' | 'submit';
};

const Button = ({ label, onClick, type = 'button' }: Props) => {
	return (
		<button className={styles.button} onClick={onClick} type={type}>
			{label}
		</button>
	);
};

export default Button;
