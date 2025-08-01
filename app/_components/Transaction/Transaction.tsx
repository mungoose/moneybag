import styles from './Transaction.module.scss';
import cx from 'classnames';

type Props = {
	id: number;
	payee: string | null;
	category: string | null;
	outflow: number;
	inflow: number;
	date: string;
	memo: string;
	isOddIndex?: boolean; // to color odd rows for better visibility
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const Transaction = ({ id, payee, category, outflow, inflow, date, memo = '', isOddIndex = false, onClick }: Props) => {
	if (date !== '') {
		date = new Date(date).toLocaleDateString();
	}

	return (
		<div className={cx(styles.transaction, { [styles.oddTransaction]: isOddIndex })} key={id} onClick={onClick}>
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
