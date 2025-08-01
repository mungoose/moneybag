type formDataTransactionSplitItemType = {
	transactionSplitId: number;
	categoryId: number;
	transactionSplitOutflow: number | string;
	transactionSplitInflow: number | string;
	memo: string;
};

export type formDataType = {
	payee: string;
	categoryId: number;
	date: string;
	memo: string;
	outflow: number | string;
	inflow: number | string;
	transactionSplits: formDataTransactionSplitItemType[];
};
