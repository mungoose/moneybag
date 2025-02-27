import styles from './Button.module.scss';

type Props = {
	label: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Button = ({ label, onClick }: Props) => {
	return (
		<button className={styles.button} onClick={onClick}>
			{label}
		</button>
	);
};

export default Button;
