'use client';

import { useEffect, useState } from 'react';
import Transaction from '@/components/Transaction/Transaction';
import BagLayout from '../bagLayout';
import styles from './styles.module.scss';
import InputForm from '@/components/InputForm/InputForm';
import TransactionsWrapper from '@/components/TransactionsWrapper/TransactionsWrapper';
import { transactions as rawTransactions } from '@/_data/transactions';
import TransactionHeader from '@/_components/TransactionHeader/TransactionHeader';
import type { TransactionsType, SpreadTransaction } from '@/types/transactions';

const transactionsSpreader = (transactions: TransactionsType) => {
	const spreadTransactions: SpreadTransaction[] = [];

	const returnZeroForNegativeValue = (value: number) => (value < 0 ? 0 : value);

	transactions.map((transaction) => {
		const { categorySplit } = transaction;

		// if category is not split, then push only one transaction
		if (categorySplit.length === 1) {
			const { category, categorySplitOutflow, categorySplitInflow, memo } = categorySplit[0];

			spreadTransactions.push({
				...transaction,
				category,
				outflow: categorySplitOutflow,
				inflow: categorySplitInflow,
				memo,
			});

			return;
		}

		// if category is split, then first push sum of the transaction
		spreadTransactions.push({
			id: transaction.id,
			payee: transaction.payee,
			category: null,
			outflow: returnZeroForNegativeValue(
				categorySplit.reduce(
					(accumulator, currentValue) =>
						accumulator + currentValue.categorySplitOutflow - currentValue.categorySplitInflow,
					0,
				),
			),
			inflow: returnZeroForNegativeValue(
				categorySplit.reduce(
					(accumulator, currentValue) =>
						accumulator + currentValue.categorySplitInflow - currentValue.categorySplitOutflow,
					0,
				),
			),
			date: transaction.date,
			memo: categorySplit[0].memo,
		});

		// then push each category split
		categorySplit.map((category, i) => {
			spreadTransactions.push({
				id: transaction.id + i,
				payee: null,
				category: category.category,
				outflow: category.categorySplitOutflow,
				inflow: category.categorySplitInflow,
				date: null,
				memo: category.memo,
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

	console.log('... transactions: ', transactions);

	const spreadTransactions = transactionsSpreader(rawTransactions);

	return (
		<BagLayout className={styles.page}>
			<h1>Bag</h1>
			<InputForm />
			<TransactionsWrapper>
				<TransactionHeader />
				{spreadTransactions.map((transaction, i) => (
					<Transaction {...transaction} key={i} />
				))}
			</TransactionsWrapper>
		</BagLayout>
	);
};

export default Bag;
