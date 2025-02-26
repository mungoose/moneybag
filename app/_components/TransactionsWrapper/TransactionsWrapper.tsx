import styles from './TransactionsWrapper.module.scss';

type Props = {
	children: React.ReactNode;
};

const TransactionsWrapper = ({ children }: Props) => {
	return <div className={styles.wrapper}>{children}</div>;
};

export default TransactionsWrapper;
