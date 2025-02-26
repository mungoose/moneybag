import Transaction from '@/_components/Transaction/Transaction';
import BagLayout from '../bagLayout';
import styles from './styles.module.scss';
import InputForm from '@/components/InputForm/InputForm';
import TransactionsWrapper from '@/components/TransactionsWrapper/TransactionsWrapper';
import { transactions } from '@/_data/transactions';

const Bag = () => {
	return (
		<BagLayout className={styles.page}>
			<h1>Bag</h1>
			<InputForm className={styles.form} />
			<TransactionsWrapper>
				<Transaction date="Date" payee="Payee" category="Category" sum="Sum" memo="Memo" isHeader />
				{transactions.map((transaction, i) => (
					<Transaction key={i} {...transaction} />
				))}
			</TransactionsWrapper>
		</BagLayout>
	);
};

export default Bag;
