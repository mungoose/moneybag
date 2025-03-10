import type { ReactNode } from 'react';
import styles from './TransactionsWrapper.module.scss';

type Props = {
	children: ReactNode;
};

const TransactionsWrapper = ({ children }: Props) => {
	return <div className={styles.wrapper}>{children}</div>;
};

export default TransactionsWrapper;
