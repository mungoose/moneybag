export type TransactionsType = TransactionType[];

export type TransactionType = {
	id: number;
	payee: string;
	categorySplit: CategorySplit;
	date: string;
};

export type SpreadTransaction = {
	id: number;
	payee: string | null;
	category: string | null;
	outflow: number;
	inflow: number;
	date: string | null;
	memo: string;
};

type CategorySplit = CategorySplitItem[];

type CategorySplitItem = {
	category: string;
	categorySplitOutflow: number;
	categorySplitInflow: number;
	memo: string;
};
