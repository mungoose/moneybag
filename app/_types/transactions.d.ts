export type TransactionsType = TransactionItemType[];

export type TransactionItemType = {
	id: number;
	payee: string;
	transactionSplits: TransactionSplitsType;
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

type TransactionSplitsType = TransactionSplitItemType[];

type TransactionSplitItemType = {
	categoryId: number;
	transactionSplitOutflow: number;
	transactionSplitInflow: number;
	memo: string;
};
