'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { TransactionSplitType, TransactionItemType } from '@/types/transactions';
import Button from '@/components//Button/Button';
import InputField from '@/components/Input/InputField';
import InlineError from '@/components/InlineError/InlineError';
import styles from './InputForm.module.scss';

type formDataTransactionSplitType = {
	transactionSplitId: number;
	category: '';
	transactionSplitOutflow: 0;
	transactionSplitInflow: 0;
	memo: '';
};

type formDataType = {
	payee: '';
	category: '';
	date: string;
	memo: '';
	outflow: 0;
	inflow: 0;
	transactionSplit: formDataTransactionSplitType[];
};

const InputForm: React.FC = () => {
	const [isTransactionSplitFormVisible, setIsTransactionSplitFormVisiblee] = useState(false);
	const [formData, setFormData] = useState<formDataType>({
		payee: '',
		category: '',
		date: new Date().toISOString().split('T')[0],
		memo: '',
		outflow: 0,
		inflow: 0,
		transactionSplit: [],
	});
	const [errors, setErrors] = useState<{
		payee?: string;
		category?: string;
		amount?: string;
		transactionSplits?: string[];
	}>({});
	const [submitAttempted, setSubmitAttempted] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
		setFormData((prev) => ({ ...prev, [field]: e.target.value }));
	};

	const handleTransactionSplitChange = (transactionSplitId: number, field: string, value: string | number) => {
		setFormData((prev) => ({
			...prev,
			transactionSplit: prev.transactionSplit.map((transaction) =>
				transaction.transactionSplitId === transactionSplitId
					? { ...transaction, [field]: value }
					: transaction,
			),
		}));
	};

	const addTransactionSplit = () => {
		setFormData((prev) => ({
			...prev,
			transactionSplit: [
				...prev.transactionSplit,
				{
					transactionSplitId: Date.now(),
					category: '',
					transactionSplitOutflow: 0,
					transactionSplitInflow: 0,
					memo: '',
				},
			],
		}));
	};

	const removeTransactionSplit = (transactionSplitId: number) => {
		setFormData((prev) => ({
			...prev,
			transactionSplit: prev.transactionSplit.filter(
				(transaction) => transaction.transactionSplitId !== transactionSplitId,
			),
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

		// check that if transaction is not split, then main category field is filled
		if (!formData.category && formData.transactionSplit.length === 0) {
			newErrors.category = 'Category is required';
		}

		const splitErrors: string[] = [];
		// check that every transaction split has category and outflow or inflow
		formData.transactionSplit.forEach((split, index) => {
			if (!split.category) {
				splitErrors[index] = `Category is required for split #${index + 1}`;
			} else if (!split.transactionSplitOutflow && !split.transactionSplitInflow) {
				splitErrors[index] = `Outflow or Inflow is required for split #${index + 1}`;
			}
		});

		if (splitErrors.length > 0) {
			newErrors.transactionSplits = splitErrors;
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
		// even if transaction is not split, save it as split transaction (with one transaction split)
		const transactionSplit: TransactionSplitType =
			formData.transactionSplit.length > 0
				? formData.transactionSplit
				: [
						{
							category: formData.category,
							transactionSplitOutflow: Number(formData.outflow),
							transactionSplitInflow: Number(formData.inflow),
							memo: formData.memo || '',
						},
					];

		const newTransaction: TransactionItemType = {
			id: Date.now(),
			payee: formData.payee,
			date: formData.date,
			transactionSplit,
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
			transactionSplit: [],
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
						setIsTransactionSplitFormVisiblee(!isTransactionSplitFormVisible);
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
			{isTransactionSplitFormVisible && (
				<div className={styles.splitTransactionsWrapper}>
					{errors.transactionSplits &&
						errors.transactionSplits.map((error, index) => (
							<InlineError key={index} errorMessage={error} visible={!!error} />
						))}
					{formData.transactionSplit.map(
						({ transactionSplitId, category, transactionSplitOutflow, transactionSplitInflow, memo }) => (
							<div key={transactionSplitId} className={styles.splitTransaction}>
								<InputField
									label="Category"
									addButton
									buttonLabel="Remove"
									onClick={(e) => {
										e.preventDefault();
										removeTransactionSplit(transactionSplitId);
									}}
									value={category}
									onChange={(e) =>
										handleTransactionSplitChange(transactionSplitId, 'category', e.target.value)
									}
								/>

								<div className={styles.outFlowInflow}>
									<InputField
										label="Outflow"
										type="number"
										value={transactionSplitOutflow}
										onChange={(e) =>
											handleTransactionSplitChange(
												transactionSplitId,
												'transactionSplitOutflow',
												e.target.value,
											)
										}
									/>
									<InputField
										label="Inflow"
										type="number"
										value={transactionSplitInflow}
										onChange={(e) =>
											handleTransactionSplitChange(
												transactionSplitId,
												'transactionSplitInflow',
												e.target.value,
											)
										}
									/>
								</div>
								<InputField
									label="Memo"
									textarea
									value={memo}
									onChange={(e) =>
										handleTransactionSplitChange(transactionSplitId, 'memo', e.target.value)
									}
								/>
							</div>
						),
					)}
					<br />
					<Button
						label="Add another one"
						onClick={(e) => {
							e.preventDefault();
							addTransactionSplit();
						}}
					/>
				</div>
			)}
		</form>
	);
};

export default InputForm;
