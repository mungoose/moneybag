'use client';

import { useEffect, useState } from 'react';
import Transaction from '@/components/Transaction/Transaction';
import BagLayout from '../bagLayout';
import styles from './styles.module.scss';
import InputForm from '@/components/InputForm/InputForm';
import TransactionsWrapper from '@/components/TransactionsWrapper/TransactionsWrapper';
import TransactionHeader from '@/_components/TransactionHeader/TransactionHeader';
import type { TransactionsType, SpreadTransactionItemType } from '@/types/transactions';

const transactionsSpreader = (transactions: TransactionsType) => {
	const spreadTransactions: SpreadTransactionItemType[] = [];

	const returnZeroForNegativeValue = (value: number) => (value < 0 ? 0 : value);

	transactions.map((transaction, index) => {
		const { transactionSplits } = transaction;

		if (!transactionSplits) {
			return;
		}

		// if category is not split, then push only one transaction
		if (transactionSplits.length === 1) {
			const { categoryId, transactionSplitOutflow, transactionSplitInflow, memo } = transactionSplits[0];

			// TODO - here needs to be logic to map categoryId to category name, it needs to be a reusable function
			console.log('categoryId', categoryId);

			spreadTransactions.push({
				...transaction,
				displayIndex: index,
				category: '** category name **',
				outflow: transactionSplitOutflow || 0,
				inflow: transactionSplitInflow || 0,
				memo,
			});

			return;
		}

		// if category is split, then first push sum of the transaction
		spreadTransactions.push({
			id: transaction.id,
			displayIndex: index,
			payee: transaction.payee,
			category: null,
			outflow: returnZeroForNegativeValue(
				transactionSplits.reduce(
					(accumulator, currentValue) =>
						accumulator +
						(currentValue.transactionSplitOutflow || 0) -
						(currentValue.transactionSplitInflow || 0),
					0,
				),
			),
			inflow: returnZeroForNegativeValue(
				transactionSplits.reduce(
					(accumulator, currentValue) =>
						accumulator +
						(currentValue.transactionSplitInflow || 0) -
						(currentValue.transactionSplitOutflow || 0),
					0,
				),
			),
			date: transaction.date,
			memo: transactionSplits[0].memo,
		});

		// TODO - here needs to be logic to map categoryId to category name, it needs to be a reusable function

		// then push each category split
		transactionSplits.map((split, i) => {
			spreadTransactions.push({
				id: transaction.id + i,
				displayIndex: index,
				payee: null,
				category: '** category name **',
				outflow: split.transactionSplitOutflow || 0,
				inflow: split.transactionSplitInflow || 0,
				date: null,
				memo: split.memo,
			});
		});
	});

	return spreadTransactions;
};

const Bag = () => {
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
		setTransactions(storedTransactions);
	}, []);

	const spreadTransactions = transactionsSpreader(transactions);

	return (
		<BagLayout className={styles.page}>
			<h1>Bag</h1>
			<InputForm />
			<TransactionsWrapper>
				<TransactionHeader />
				{spreadTransactions.map((transaction, i) => (
					<Transaction {...transaction} key={i} isOddIndex={!(transaction.displayIndex % 2)} />
				))}
			</TransactionsWrapper>
		</BagLayout>
	);
};

export default Bag;
