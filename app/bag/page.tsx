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
		const { transactionSplit } = transaction;

		// if category is not split, then push only one transaction
		if (transactionSplit.length === 1) {
			const { category, transactionSplitOutflow, transactionSplitInflow, memo } = transactionSplit[0];

			spreadTransactions.push({
				...transaction,
				displayIndex: index,
				category,
				outflow: transactionSplitOutflow,
				inflow: transactionSplitInflow,
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
				transactionSplit.reduce(
					(accumulator, currentValue) =>
						accumulator + currentValue.transactionSplitOutflow - currentValue.transactionSplitInflow,
					0,
				),
			),
			inflow: returnZeroForNegativeValue(
				transactionSplit.reduce(
					(accumulator, currentValue) =>
						accumulator + currentValue.transactionSplitInflow - currentValue.transactionSplitOutflow,
					0,
				),
			),
			date: transaction.date,
			memo: transactionSplit[0].memo,
		});

		// then push each category split
		transactionSplit.map((split, i) => {
			spreadTransactions.push({
				id: transaction.id + i,
				displayIndex: index,
				payee: null,
				category: split.category,
				outflow: split.transactionSplitOutflow,
				inflow: split.transactionSplitInflow,
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
