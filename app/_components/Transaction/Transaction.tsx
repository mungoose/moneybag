import styles from './Transaction.module.scss';
import type { Transaction as TransactionType } from '@/_types/transactions';

interface Props extends TransactionType {
	isHeader?: boolean;
}

const Transaction = ({ sum, payee, category, memo = '', date, isHeader = false }: Props) => {
	const dateToUse = date ? date : new Date().toLocaleDateString();

	return (
		<div className={isHeader ? styles.transactionHeader : styles.transaction}>
			<div className={styles.item}>{dateToUse}</div>
			<div className={styles.item}>{payee}</div>
			<div className={styles.item}>{category}</div>
			<div className={styles.item}>{sum}</div>
			<div className={styles.item}>{memo}</div>
		</div>
	);
};

export default Transaction;
