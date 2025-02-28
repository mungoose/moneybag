import styles from './Transaction.module.scss';

type Props = {
	id: number;
	payee: string | null;
	category: string | null;
	outflow: number;
	inflow: number;
	date: string;
	memo?: string | null;
};

const Transaction = ({ id, payee, category, outflow, inflow, date, memo = null }: Props) => {
	return (
		<div className={styles.transaction} key={id}>
			<div className={styles.item}>{date}</div>
			<div className={styles.item}>{payee}</div>
			<div className={styles.item}>{category}</div>
			<div className={styles.item}>{outflow}</div>
			<div className={styles.item}>{inflow}</div>
			<div className={styles.item}>{memo}</div>
		</div>
	);
};

export default Transaction;
