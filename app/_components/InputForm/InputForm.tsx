import InputField from '../Input/InputField';
import styles from './InputForm.module.scss';

const InputForm = () => {
	return (
		<form className={styles.form}>
			<InputField label="Sum" type="number" />
			<InputField label="Payee" />
			<InputField label="Category" />
			<InputField label="Date" type="date" />
			<InputField label="Memo" textarea />
			<button className={styles.button} type="submit">
				Submit
			</button>
		</form>
	);
};

export default InputForm;
