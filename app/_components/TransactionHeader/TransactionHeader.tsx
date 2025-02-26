import styles from './TransactionHeader.module.scss';

const TransactionHeader = () => {
	return (
		<div className={styles.transactionHeader}>
			<div className={styles.item}>Date</div>
			<div className={styles.item}>Payee</div>
			<div className={styles.item}>Category</div>
			<div className={styles.item}>Outflow</div>
			<div className={styles.item}>Inflow</div>
			<div className={styles.item}>Memo</div>
		</div>
	);
};

export default TransactionHeader;
