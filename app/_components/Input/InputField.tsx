import Button from '../Button/Button';
import styles from './InputField.module.scss';
import cx from 'classnames';

type Props = {
	label: string;
	type?: string;
	addButton?: boolean;
	buttonLabel?: string;
	textarea?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const InputField = ({
	label,
	type = 'text',
	addButton = false,
	buttonLabel = '+',
	textarea = false,
	onClick,
}: Props) => {
	return (
		<div className={styles.inputField}>
			<label className={styles.label}>{label}</label>
			<div className={cx(addButton && styles.inputWrapper)}>
				{textarea ? <textarea className={styles.textarea} /> : <input className={styles.input} type={type} />}
				{addButton && onClick && (
					<Button
						label={buttonLabel}
						onClick={(e) => {
							e.preventDefault();
							onClick(e);
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default InputField;
