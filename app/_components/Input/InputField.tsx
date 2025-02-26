import styles from './InputField.module.scss';

type Props = {
	label: string;
	type?: string;
	textarea?: boolean;
};

const InputField = ({ label, type = 'text', textarea = false }: Props) => {
	return (
		<div className={styles.inputField}>
			<label className={styles.label}>{label}</label>
			{textarea ? <textarea className={styles.textarea} /> : <input className={styles.input} type={type} />}
		</div>
	);
};

export default InputField;
