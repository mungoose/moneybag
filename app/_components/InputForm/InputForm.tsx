'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { CategorySplit, TransactionType } from '@/types/transactions';
import Button from '@/components//Button/Button';
import InputField from '@/components/Input/InputField';
import InlineError from '@/components/InlineError/InlineError';
import styles from './InputForm.module.scss';

type formDataCategorySplitType = {
	categorySplitId: number;
	category: '';
	categorySplitOutflow: 0;
	categorySplitInflow: 0;
	memo: '';
};

type formDataType = {
	payee: '';
	category: '';
	date: string;
	memo: '';
	outflow: 0;
	inflow: 0;
	categorySplit: formDataCategorySplitType[];
};

const InputForm: React.FC = () => {
	const [isCategorySplitFormVisible, setIsCategorySplitFormVisiblee] = useState(false);
	const [formData, setFormData] = useState<formDataType>({
		payee: '',
		category: '',
		date: new Date().toISOString().split('T')[0],
		memo: '',
		outflow: 0,
		inflow: 0,
		categorySplit: [],
	});
	const [errors, setErrors] = useState<{
		payee?: string;
		category?: string;
		amount?: string;
		categorySplits?: string[];
	}>({});
	const [submitAttempted, setSubmitAttempted] = useState(false);

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

	const handleErrorsOnSubmit = (formData: formDataType) => {
		const newErrors: typeof errors = {};

		// check mandatory payee field
		if (!formData.payee) {
			newErrors.payee = 'Payee is required';
		}

		// check that either outlfow or inflow is filled
		if (!formData.outflow && !formData.inflow) {
			newErrors.amount = 'Outflow or Inflow is required';
		}

		// check that if category is not split, then main category field is filled
		if (!formData.category && formData.categorySplit.length === 0) {
			newErrors.category = 'Category is required';
		}

		const splitErrors: string[] = [];
		// check that every category split has category and outflow or inflow
		formData.categorySplit.forEach((split, index) => {
			if (!split.category) {
				splitErrors[index] = `Category is required for split #${index + 1}`;
			} else if (!split.categorySplitOutflow && !split.categorySplitInflow) {
				splitErrors[index] = `Outflow or Inflow is required for split #${index + 1}`;
			}
		});

		if (splitErrors.length > 0) {
			newErrors.categorySplits = splitErrors;
		}

		// if there are any errors, update state and return
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		// if there are no errors, clear errors
		setErrors({});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitAttempted(true);
		handleErrorsOnSubmit(formData);
	};

	const saveTransaction = useCallback(() => {
		// even if transaction is not split, save it as split transaction (with one category split)
		const categorySplit: CategorySplit =
			formData.categorySplit.length > 0
				? formData.categorySplit
				: [
						{
							category: formData.category,
							categorySplitOutflow: formData.outflow,
							categorySplitInflow: formData.inflow,
							memo: formData.memo || '',
						},
					];

		const newTransaction: TransactionType = {
			id: Date.now(),
			payee: formData.payee,
			date: formData.date,
			categorySplit,
		};

		const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
		const updatedTransactions = [...storedTransactions, newTransaction];

		// temporarily add to localStorage!!!
		localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

		console.log('Saved:', newTransaction);
		handleReset();
	}, [formData]);

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

		setErrors({});
	};

	useEffect(() => {
		// if submission was attempted and there are no erros, proceed
		if (submitAttempted && Object.keys(errors).length === 0) {
			saveTransaction();
			setSubmitAttempted(false);
		}
	}, [errors, saveTransaction, submitAttempted]);

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
				</div>
				<InlineError visible={!!errors.amount} errorMessage={errors.amount} />
				<InputField label="Payee" value={formData.payee} onChange={(e) => handleChange(e, 'payee')} />
				<InlineError visible={!!errors.payee} errorMessage={errors.payee} />
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
				<InlineError visible={!!errors.category} errorMessage={errors.category} />
				<InputField
					label="Date"
					type="date"
					value={formData.date}
					onChange={(e) => handleChange(e, 'date')}
					addBottomMargin={true}
				/>
				<InputField label="Memo" textarea value={formData.memo} onChange={(e) => handleChange(e, 'memo')} />
				<Button label="Submit" type="submit" />
				<br />
				<Button label="Reset" onClick={handleReset} />
			</div>
			{isCategorySplitFormVisible && (
				<div className={styles.splitCategoriesWrapper}>
					{errors.categorySplits &&
						errors.categorySplits.map((error, index) => (
							<InlineError key={index} errorMessage={error} visible={!!error} />
						))}
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
					<br />
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
