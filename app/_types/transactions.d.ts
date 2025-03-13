export type TransactionsType = TransactionItemType[];

export type TransactionItemType = {
	id: number;
	payee: string;
	transactionSplit: TransactionSplitType;
	date: string;
};

export type SpreadTransactionItemType = {
	id: number;
	displayIndex: number;
	payee: string | null;
	category: string | null;
	outflow: number;
	inflow: number;
	date: string | null;
	memo: string;
};

type TransactionSplitType = TransactionSplitItemType[];

type TransactionSplitItemType = {
	category: string;
	transactionSplitOutflow: number;
	transactionSplitInflow: number;
	memo: string;
};
