export type Transactions = Transaction[];

export type Transaction = {
	sum: number | string;
	payee: string;
	category: string;
	memo?: string;
	date?: string;
};
