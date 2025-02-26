export type TransactionsType = TransactionType[];

export type TransactionType = {
	id: number;
	payee: string;
	categorySplit: CategorySplit;
	date?: string;
};

export type SpreadTransaction = {
	id: number;
	payee: string | null;
	mainCategory: string | null;
	subCategory: string | null;
	outflow: number;
	inflow: number;
	date?: string | null;
	memo?: string;
};

type CategorySplit = CategorySplitItem[];

type CategorySplitItem = {
	mainCategory: string;
	subCategory: string;
	subCategoryOutflow: number;
	subCategoryInflow: number;
	memo: string;
};
