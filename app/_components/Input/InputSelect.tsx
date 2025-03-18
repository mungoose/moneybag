import styles from './Input.module.scss';

type Props = {
	label: string;
	selectValue: number;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	disabled?: boolean;
	options: { id: number; name: string }[];
};

const InputSelect = ({ label, selectValue, onChange, disabled = false, options }: Props) => {
	return (
		<div className={styles.inputField}>
			<label className={styles.label}>{label}</label>
			<select value={selectValue ?? 0} onChange={onChange} className={styles.input} disabled={disabled}>
				<option value={0}>Category</option>
				{options.map((option, index) => {
					const [id, name] = Object.values(option);
					return (
						<option key={index} value={id}>
							{name}
						</option>
					);
				})}
			</select>
		</div>
	);
};

export default InputSelect;
