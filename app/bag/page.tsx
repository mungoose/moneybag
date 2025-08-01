'use client';

import { useEffect, useState } from 'react';
import type { CombinedTransactionsType, SpreadTransactionItemType } from '@/types/transactions';
import Transaction from '@/components/Transaction/Transaction';
import BagLayout from '../bagLayout';
import styles from './styles.module.scss';
import InputForm from '@/components/InputForm/InputForm';
import TransactionsWrapper from '@/components/TransactionsWrapper/TransactionsWrapper';
import TransactionHeader from '@/_components/TransactionHeader/TransactionHeader';
import { combineTransactionsFetchedFromDB } from '@/utils/combineTransactionsFetchedFromDB';

const transactionsSpreader = (transactions: CombinedTransactionsType) => {
	const spreadTransactions: SpreadTransactionItemType[] = [];

	const returnZeroForNegativeValue = (value: number) => (value < 0 ? 0 : value);

	if (!transactions) {
		return [];
	}

	transactions.map((transaction, index) => {
		const { transactionSplits } = transaction;

		if (!transactionSplits) {
			return;
		}

		// if category is not split, then push only one transaction
		if (transactionSplits.length === 1) {
			const { category, outflow, inflow, memo } = transactionSplits[0];

			spreadTransactions.push({
				...transaction,
				displayIndex: index,
				category: category,
				outflow: outflow || 0,
				inflow: inflow || 0,
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
						accumulator + (currentValue.outflow || 0) - (currentValue.inflow || 0),
					0,
				),
			),
			inflow: returnZeroForNegativeValue(
				transactionSplits.reduce(
					(accumulator, currentValue) =>
						accumulator + (currentValue.inflow || 0) - (currentValue.outflow || 0),
					0,
				),
			),
			date: transaction.date,
			memo: transactionSplits[0].memo, // TODO - this should be correctly separately saved into Transaction table!! (not in splits)
		});

		// then push each category split
		transactionSplits.map((split, i) => {
			spreadTransactions.push({
				id: transaction.id + i,
				displayIndex: index,
				payee: null,
				category: split.category,
				outflow: split.outflow || 0,
				inflow: split.inflow || 0,
				date: '',
				memo: split.memo,
			});
		});
	});

	return spreadTransactions;
};

const Bag = () => {
	const [transactions, setTransactions] = useState<CombinedTransactionsType>();
	const [selectedTransaction, setSelectedTransaction] = useState<SpreadTransactionItemType | null>(null);

	const fetchTransactions = async () => {
		const fetchedTransactions: CombinedTransactionsType = await combineTransactionsFetchedFromDB();

		setTransactions(fetchedTransactions);
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	const spreadTransactions = transactions ? transactionsSpreader(transactions) : [];

	// NB: to populate form with existing data we first need change the Transactions component
	// so that it would group transactions and clicking any part of it would open it in the form!

	// NB: we also need to change the spreading logic, change the types and possibly get rid of SpreadTransactionItemType
	// and use CombinedTransactionSplitItemType instead

	return (
		<BagLayout className={styles.page}>
			<h1>Bag</h1>
			<InputForm
				onSubmit={fetchTransactions}
				selectedTransaction={selectedTransaction}
				onCancel={() => setSelectedTransaction(null)}
			/>
			<TransactionsWrapper>
				<TransactionHeader />
				{spreadTransactions.map((transaction, i) => (
					<Transaction
						{...transaction}
						key={i}
						isOddIndex={!(transaction.displayIndex % 2)}
						onClick={() => setSelectedTransaction(transaction)}
					/>
				))}
			</TransactionsWrapper>
		</BagLayout>
	);
};

export default Bag;
