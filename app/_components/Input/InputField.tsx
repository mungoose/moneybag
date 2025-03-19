import Button from '../Button/Button';
import styles from './Input.module.scss';
import cx from 'classnames';

type Props = {
	label: string;
	type?: string;
	value?: string | number;
	onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	addButton?: boolean;
	buttonLabel?: string;
	textarea?: boolean;
	addBottomMargin?: boolean;
	isDisabled?: boolean;
	placeHolderText?: string;
};

const InputField = ({
	label,
	type = 'text',
	value,
	onChange,
	onClick,
	addButton = false,
	buttonLabel = '+',
	textarea = false,
	addBottomMargin,
	isDisabled = false,
	placeHolderText,
}: Props) => {
	return (
		<div className={cx(styles.inputField, { [styles.addBottomMargin]: addBottomMargin })}>
			<label className={styles.label}>{label}</label>
			<div className={cx(addButton && styles.inputWrapper)}>
				{textarea ? (
					<textarea
						className={styles.textarea}
						value={value}
						onChange={onChange}
						disabled={isDisabled}
						placeholder={placeHolderText}
					/>
				) : (
					<input
						className={styles.input}
						type={type}
						value={value}
						onChange={onChange}
						placeholder={placeHolderText}
					/>
				)}
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
