'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import { addTransaction } from '@/supabase/transactions';
import type { TransactionSplitsType, TransactionItemType } from '@/types/transactions';
import Button from '@/components//Button/Button';
import InputField from '@/components/Input/InputField';
import InlineError from '@/components/InlineError/InlineError';
import styles from './InputForm.module.scss';
import InputSelect from '../Input/InputSelect';

type Props = {
	onSubmit: () => void;
};

type formDataTransactionSplitItemType = {
	transactionSplitId: number;
	categoryId: number;
	transactionSplitOutflow: number | string;
	transactionSplitInflow: number | string;
	memo: string;
};

type formDataType = {
	payee: string;
	categoryId: number;
	date: string;
	memo: string;
	outflow: number | string;
	inflow: number | string;
	transactionSplits: formDataTransactionSplitItemType[];
};

const currentDate = new Date().toISOString().split('T')[0];

const InputForm: React.FC<Props> = ({ onSubmit }) => {
	const [formData, setFormData] = useState<formDataType>({
		payee: '',
		categoryId: 0,
		date: currentDate,
		memo: '',
		outflow: '',
		inflow: '',
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
	const [transactionSplitsVisibleCount, setTransactionSplitsVisibleCount] = useState<number>(0);

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
		const value = e.target.value;

		setFormData((prev) => ({
			...prev,
			[field]: value,
			...(field === 'outflow' ? { inflow: '' } : field === 'inflow' ? { outflow: '' } : {}),
		}));
	};

	const handleTransactionSplitChange = (transactionSplitId: number, field: string, value: string | number) => {
		setFormData((prev) => ({
			...prev,
			transactionSplits: prev.transactionSplits.map((transaction) =>
				transaction.transactionSplitId === transactionSplitId
					? {
							...transaction,
							[field]: value,
							...(field === 'transactionSplitOutflow'
								? { transactionSplitInflow: '' }
								: field === 'transactionSplitInflow'
									? { transactionSplitOutflow: '' }
									: {}),
						}
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
					transactionSplitOutflow: '',
					transactionSplitInflow: '',
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

	const saveTransaction = useCallback(async () => {
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
							transactionSplitOutflow: Number(formData.outflow || ''),
							transactionSplitInflow: Number(formData.inflow || ''),
							memo: formData.memo || '',
						},
					];

		const newTransaction: TransactionItemType = {
			id: Date.now(),
			payee: formData.payee,
			date: formData.date,
			transactionSplits,
		};

		// save to database
		try {
			await addTransaction(newTransaction);
			onSubmit();
		} catch (error) {
			console.error('Error saving transaction: ', error);

			return;
		}

		handleReset();
	}, [formData, onSubmit, selectedCategoryId]);

	const handleReset = () => {
		setFormData({
			payee: '',
			categoryId: 0,
			date: currentDate,
			memo: '',
			outflow: '',
			inflow: '',
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
						placeHolderText="Outflow"
					/>
					<InputField
						label="Inflow"
						type="number"
						value={formData.inflow}
						onChange={(e) => handleChange(e, 'inflow')}
						placeHolderText="Inflow"
					/>
				</div>
				<InlineError visible={!!errors.amount} errorMessage={errors.amount} />
				<InputField label="Payee" value={formData.payee} onChange={(e) => handleChange(e, 'payee')} />
				<InlineError visible={!!errors.payee} errorMessage={errors.payee} />
				<InputSelect
					label="Category"
					selectValue={selectedCategoryId}
					onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
					disabled={transactionSplitsVisibleCount === 0 ? false : true}
					options={categories}
				/>
				<InlineError visible={!!errors.category} errorMessage={errors.category} />
				<InputField
					label="Date"
					type="date"
					value={formData.date}
					onChange={(e) => handleChange(e, 'date')}
					addBottomMargin={true}
				/>
				<InputField
					label="Memo"
					placeHolderText={transactionSplitsVisibleCount === 1 ? 'Use the split memo!' : ''}
					textarea
					value={formData.memo}
					onChange={(e) => handleChange(e, 'memo')}
					isDisabled={transactionSplitsVisibleCount === 1 ? true : false}
				/>
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
				{formData.transactionSplits.map(
					({ transactionSplitId, categoryId, transactionSplitOutflow, transactionSplitInflow, memo }) => (
						<div key={transactionSplitId} className={styles.splitTransaction}>
							<div className={styles.categoryOutlfowInflow}>
								<InputSelect
									label="Category"
									selectValue={categoryId}
									onChange={(e) =>
										handleTransactionSplitChange(
											transactionSplitId,
											'categoryId',
											Number(e.target.value),
										)
									}
									options={categories}
								/>
								<InputField
									label="Out"
									type="number"
									value={transactionSplitOutflow}
									onChange={(e) =>
										handleTransactionSplitChange(
											transactionSplitId,
											'transactionSplitOutflow',
											e.target.value,
										)
									}
									placeHolderText="Out"
								/>
								<InputField
									label="In"
									type="number"
									value={transactionSplitInflow}
									onChange={(e) =>
										handleTransactionSplitChange(
											transactionSplitId,
											'transactionSplitInflow',
											e.target.value,
										)
									}
									placeHolderText="In"
								/>
							</div>
							{errors.transactionSplits?.map((error, index) => (
								<InlineError key={index} errorMessage={error} visible={!!error} />
							))}
							<InputField
								label="Memo"
								textarea
								value={memo}
								onChange={(e) =>
									handleTransactionSplitChange(transactionSplitId, 'memo', e.target.value)
								}
							/>
							<Button
								onClick={(e) => {
									e.preventDefault();
									removeTransactionSplit(transactionSplitId);
									setTransactionSplitsVisibleCount(transactionSplitsVisibleCount - 1);
								}}
								label={'Remove split'}
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
						setTransactionSplitsVisibleCount(transactionSplitsVisibleCount + 1);
					}}
				/>
			</div>
		</form>
	);
};

export default InputForm;
