export type TransactionsType = TransactionItemType[];

export type TransactionItemType = {
	id: number;
	payee: string;
	transactionSplits: TransactionSplitsType;
	date: string;
};

export type CategoryType = {
	id: number;
	name: string;
	parentCategoryId: number | null;
};

export type CombinedTransactionsType = {
	id: number;
	payee: string;
	transactionSplits: CombinedTransactionsSplitsType;
	date: string;
};

type CombinedTransactionsSplitsType = CombinedTransactionSplitItemType[];

type CombinedTransactionSplitItemType = {
	id: number;
	categoryId: number;
	category: string;
	outflow: number;
	inflow: number;
	memo: string;
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
	transactionSplitOutflow: number | undefined;
	transactionSplitInflow: number | undefined;
	memo: string;
};
