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
			const { mainCategory, subCategory, subCategoryOutflow, subCategoryInflow, memo } = categorySplit[0];

			spreadTransactions.push({
				...transaction,
				mainCategory,
				subCategory,
				outflow: subCategoryOutflow,
				inflow: subCategoryInflow,
				memo,
			});

			return;
		}

		// if category is split, then first push sum of the transaction
		spreadTransactions.push({
			id: transaction.id,
			payee: transaction.payee,
			mainCategory: null,
			subCategory: null,
			outflow: returnZeroForNegativeValue(
				categorySplit.reduce(
					(accumulator, currentValue) =>
						accumulator + currentValue.subCategoryOutflow - currentValue.subCategoryInflow,
					0,
				),
			),
			inflow: returnZeroForNegativeValue(
				categorySplit.reduce(
					(accumulator, currentValue) =>
						accumulator + currentValue.subCategoryInflow - currentValue.subCategoryOutflow,
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
				mainCategory: category.mainCategory,
				subCategory: category.subCategory,
				outflow: category.subCategoryOutflow,
				inflow: category.subCategoryInflow,
				date: null,
				memo: category.memo,
			});
		});
	});

	return spreadTransactions;
};

const Bag = () => {
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
