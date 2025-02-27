'use client';

import React, { useState } from 'react';
import Button from '../Button/Button';
import InputField from '../Input/InputField';
import styles from './InputForm.module.scss';

const InputForm: React.FC = () => {
	const [isSplitCategoryFormVisible, setIsSplitCategoryFormVisible] = useState(false);
	const [splitCategories, setSplitCategories] = useState([{ id: Date.now() }]);

	const addSplitCategory = () => {
		setSplitCategories([...splitCategories, { id: Date.now() }]);
	};

	const removeSplitCategory = (id: number) => {
		setSplitCategories(splitCategories.filter((category) => category.id !== id));
	};

	return (
		<form className={styles.formWrapper}>
			<div className={styles.singleForm}>
				<InputField label="Sum" type="number" />
				<InputField label="Payee" />
				<InputField
					label="Category"
					addButton
					buttonLabel="Split"
					onClick={() => {
						setIsSplitCategoryFormVisible(!isSplitCategoryFormVisible);
					}}
				/>
				<InputField label="Date" type="date" />
				<InputField label="Memo" textarea />
				<Button label="Submit" onClick={() => alert('Submitted')} />
				<br />
				<Button label="Reset" onClick={() => alert('Reset')} />
			</div>
			{isSplitCategoryFormVisible && (
				<div className={styles.splitCategoriesWrapper}>
					{splitCategories.map(({ id }) => (
						<div key={id} className={styles.splitCategory}>
							<InputField
								label="Category"
								addButton
								buttonLabel="Remove"
								onClick={(e) => {
									e.preventDefault();
									removeSplitCategory(id);
								}}
							/>
							<div className={styles.outFlowInflow}>
								<InputField label="Outflow" type="number" />
								<InputField label="Inflow" type="number" />
							</div>
						</div>
					))}
					<Button
						label="Add another one"
						onClick={(e) => {
							e.preventDefault();
							addSplitCategory();
						}}
					/>
				</div>
			)}
		</form>
	);
};

export default InputForm;
