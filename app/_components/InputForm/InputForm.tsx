'use client';

import React, { useState } from 'react';
import Button from '../Button/Button';
import InputField from '../Input/InputField';
import styles from './InputForm.module.scss';

const InputForm: React.FC = () => {
	const [isCategorySplitFormVisible, setIsCategorySplitFormVisiblee] = useState(false);
	const [formData, setFormData] = useState({
		payee: '',
		category: '',
		date: new Date().toISOString().split('T')[0],
		memo: '',
		outflow: 0,
		inflow: 0,
		categorySplit: [] as {
			categorySplitId: number;
			category: '';
			categorySplitOutflow: 0;
			categorySplitInflow: 0;
			memo: '';
		}[],
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
		setFormData((prev) => ({ ...prev, [field]: e.target.value }));
	};

	const handleCategorySplitChange = (categorySplitId: number, field: string, value: string | number) => {
		setFormData((prev) => ({
			...prev,
			categorySplit: prev.categorySplit.map((category) =>
				category.categorySplitId === categorySplitId ? { ...category, [field]: value } : category,
			),
		}));
	};

	const addCategorySplit = () => {
		setFormData((prev) => ({
			...prev,
			categorySplit: [
				...prev.categorySplit,
				{
					categorySplitId: Date.now(),
					category: '',
					categorySplitOutflow: 0,
					categorySplitInflow: 0,
					memo: '',
				},
			],
		}));
	};

	const removeCategorySplit = (categorySplitId: number) => {
		setFormData((prev) => ({
			...prev,
			categorySplit: prev.categorySplit.filter((category) => category.categorySplitId !== categorySplitId),
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const newTransaction = {
			id: Date.now(),
			payee: formData.payee,
			category: formData.category,
			date: formData.date,
			memo: formData.memo,
			outflow: Number(formData.outflow),
			inflow: Number(formData.inflow),
			categorySplit: formData.categorySplit,
		};

		const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
		const updatedTransactions = [...storedTransactions, newTransaction];

		localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

		console.log('Saved:', newTransaction);
		handleReset();
	};

	const handleReset = () => {
		setFormData({
			payee: '',
			category: '',
			date: '',
			memo: '',
			outflow: 0,
			inflow: 0,
			categorySplit: [],
		});
	};

	return (
		<form className={styles.formWrapper} onSubmit={handleSubmit}>
			<div className={styles.singleForm}>
				<div className={styles.outFlowInflow}>
					<InputField
						label="Outflow"
						type="number"
						value={formData.outflow}
						onChange={(e) => handleChange(e, 'outflow')}
					/>
					<InputField
						label="Inflow"
						type="number"
						value={formData.inflow}
						onChange={(e) => handleChange(e, 'inflow')}
					/>
				</div>{' '}
				<InputField label="Payee" value={formData.payee} onChange={(e) => handleChange(e, 'payee')} />
				<InputField
					label="Category"
					addButton
					buttonLabel="Split"
					onClick={() => {
						setIsCategorySplitFormVisiblee(!isCategorySplitFormVisible);
					}}
					value={formData.category}
					onChange={(e) => handleChange(e, 'category')}
				/>
				<InputField label="Date" type="date" value={formData.date} onChange={(e) => handleChange(e, 'date')} />
				<InputField label="Memo" textarea value={formData.memo} onChange={(e) => handleChange(e, 'memo')} />
				<Button label="Submit" type="submit" />
				<br />
				<Button label="Reset" onClick={handleReset} />
			</div>
			{isCategorySplitFormVisible && (
				<div className={styles.splitCategoriesWrapper}>
					{formData.categorySplit.map(
						({ categorySplitId, category, categorySplitOutflow, categorySplitInflow, memo }) => (
							<div key={categorySplitId} className={styles.splitCategory}>
								<InputField
									label="Category"
									addButton
									buttonLabel="Remove"
									onClick={(e) => {
										e.preventDefault();
										removeCategorySplit(categorySplitId);
									}}
									value={category}
									onChange={(e) =>
										handleCategorySplitChange(categorySplitId, 'category', e.target.value)
									}
								/>
								<div className={styles.outFlowInflow}>
									<InputField
										label="Outflow"
										type="number"
										value={categorySplitOutflow}
										onChange={(e) =>
											handleCategorySplitChange(
												categorySplitId,
												'categorySplitOutflow',
												e.target.value,
											)
										}
									/>
									<InputField
										label="Inflow"
										type="number"
										value={categorySplitInflow}
										onChange={(e) =>
											handleCategorySplitChange(
												categorySplitId,
												'categorySplitInflow',
												e.target.value,
											)
										}
									/>
								</div>
								<InputField
									label="Memo"
									textarea
									value={memo}
									onChange={(e) => handleCategorySplitChange(categorySplitId, 'memo', e.target.value)}
								/>
							</div>
						),
					)}
					<Button
						label="Add another one"
						onClick={(e) => {
							e.preventDefault();
							addCategorySplit();
						}}
					/>
				</div>
			)}
		</form>
	);
};

export default InputForm;
