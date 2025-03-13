'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import type { TransactionSplitsType, TransactionItemType } from '@/types/transactions';
import Button from '@/components//Button/Button';
import InputField from '@/components/Input/InputField';
import InlineError from '@/components/InlineError/InlineError';
import styles from './InputForm.module.scss';

type formDataTransactionSplitItemType = {
	transactionSplitId: number;
	categoryId: number;
	transactionSplitOutflow: 0;
	transactionSplitInflow: 0;
	memo: '';
};

type formDataType = {
	payee: '';
	categoryId: number;
	date: string;
	memo: '';
	outflow: 0;
	inflow: 0;
	transactionSplits: formDataTransactionSplitItemType[];
};

const InputForm: React.FC = () => {
	const [formData, setFormData] = useState<formDataType>({
		payee: '',
		categoryId: 0,
		date: new Date().toISOString().split('T')[0],
		memo: '',
		outflow: 0,
		inflow: 0,
		transactionSplits: [],
	});
	const [errors, setErrors] = useState<{
		payee?: string;
		category?: string;
		amount?: string;
		transactionSplits?: string[];
	}>({});
	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

	useEffect(() => {
		const fetchCategories = async () => {
			const { data, error } = await supabase.from('categories').select('*');
			if (error) {
				console.error('Error fetching categories: ', error);
			} else {
				setCategories(data);
			}
		};

		fetchCategories();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
		setFormData((prev) => ({ ...prev, [field]: e.target.value }));
	};

	const handleTransactionSplitChange = (transactionSplitId: number, field: string, value: string | number) => {
		setFormData((prev) => ({
			...prev,
			transactionSplits: prev.transactionSplits.map((transaction) =>
				transaction.transactionSplitId === transactionSplitId
					? { ...transaction, [field]: value }
					: transaction,
			),
		}));
	};

	const addTransactionSplit = () => {
		setFormData((prev) => ({
			...prev,
			transactionSplits: [
				...prev.transactionSplits,
				{
					transactionSplitId: Date.now(),
					categoryId: 0,
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
			transactionSplits: prev.transactionSplits.filter(
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

		console.log('.... category id from selectedCategoryId: ', selectedCategoryId);

		// check that if transaction is not split, then main category field is filled
		if (selectedCategoryId === 0 && formData.transactionSplits.length === 0) {
			newErrors.category = 'Category is required';
		}

		const splitErrors: string[] = [];
		// check that every transaction split has category and outflow or inflow
		formData.transactionSplits.forEach((split, index) => {
			if (split.categoryId === 0) {
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
		if (!formData) {
			return;
		}

		// even if transaction is not split, save it as split transaction (with one transaction split)
		const transactionSplits: TransactionSplitsType =
			formData.transactionSplits.length > 0
				? formData.transactionSplits
				: [
						{
							categoryId: selectedCategoryId,
							transactionSplitOutflow: Number(formData.outflow),
							transactionSplitInflow: Number(formData.inflow),
							memo: formData.memo || '',
						},
					];

		const newTransaction: TransactionItemType = {
			id: Date.now(),
			payee: formData.payee,
			date: formData.date,
			transactionSplits,
		};

		const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
		const updatedTransactions = [...storedTransactions, newTransaction];

		console.log('Saved:', newTransaction);
		console.log('Transactions now:', updatedTransactions);
		handleReset();
	}, [formData, selectedCategoryId]);

	const handleReset = () => {
		setFormData({
			payee: '',
			categoryId: 0,
			date: '',
			memo: '',
			outflow: 0,
			inflow: 0,
			transactionSplits: [],
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
				<select value={selectedCategoryId ?? 0} onChange={(e) => setSelectedCategoryId(Number(e.target.value))}>
					<option value={0}>Select category</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
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
				<Button
					label="Reset"
					onClick={(e) => {
						e.preventDefault();
						handleReset();
					}}
				/>
			</div>
			<div className={styles.splitTransactionsWrapper}>
				{errors.transactionSplits &&
					errors.transactionSplits.map((error, index) => (
						<InlineError key={index} errorMessage={error} visible={!!error} />
					))}
				{formData.transactionSplits.map(
					({ transactionSplitId, categoryId, transactionSplitOutflow, transactionSplitInflow, memo }) => (
						<div key={transactionSplitId} className={styles.splitTransaction}>
							<select
								value={categoryId}
								onChange={(e) =>
									handleTransactionSplitChange(
										transactionSplitId,
										'categoryId',
										Number(e.target.value),
									)
								}
							>
								<option value={0}>Select category</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
							<Button
								onClick={(e) => {
									e.preventDefault();
									removeTransactionSplit(transactionSplitId);
								}}
								label={'Remove split'}
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
					label="Add split"
					onClick={(e) => {
						e.preventDefault();
						addTransactionSplit();
					}}
				/>
			</div>
		</form>
	);
};

export default InputForm;
