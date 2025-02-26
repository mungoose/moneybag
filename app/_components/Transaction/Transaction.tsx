import styles from './Transaction.module.scss';

type Props = {
	id: number;
	payee: string | null;
	mainCategory: string | null;
	subCategory: string | null;
	outflow: number;
	inflow: number;
	date?: string | null;
	memo?: string | null;
};

const currentDate = new Date().toLocaleDateString();

const Transaction = ({
	id,
	payee,
	mainCategory,
	subCategory,
	outflow,
	inflow,
	date = currentDate,
	memo = null,
}: Props) => {
	return (
		<div className={styles.transaction} key={id}>
			<div className={styles.item}>{date}</div>
			<div className={styles.item}>{payee}</div>
			<div className={styles.item}>
				{mainCategory}
				{subCategory ? ':' : '...split: '} {subCategory}
			</div>
			<div className={styles.item}>{outflow}</div>
			<div className={styles.item}>{inflow}</div>
			<div className={styles.item}>{memo}</div>
		</div>
	);
};

export default Transaction;
