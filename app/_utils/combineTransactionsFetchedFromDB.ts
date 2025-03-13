import type { CombinedTransactionsType, TransactionSplitsType, CategoryType } from '@/types/transactions';
import { getTransactions, getTransactionSplits, getCategories } from '@/supabase/transactions';

export const combineTransactionsFetchedFromDB = async (): Promise<CombinedTransactionsType> => {
	const [transactions, transactionSplits, categories] = await Promise.all([
		getTransactions(),
		getTransactionSplits(),
		getCategories(),
	]);

	// map categoires by ID for easier lookup
	if ('error' in categories) {
		throw new Error(categories.error?.message);
	}
	const categoryMap = new Map(categories.categories.map((category: CategoryType) => [category.id, category.name]));

	// group transaction splits by transaction ID
	if ('error' in transactionSplits) {
		throw new Error(transactionSplits.error?.message);
	}
	const transactionSplitsMap = transactionSplits.transactionSplits.reduce(
		(acc, split) => {
			if (!acc[split.transaction_id]) {
				acc[split.transaction_id] = [];
			}
			acc[split.transaction_id].push(split);
			return acc;
		},
		{} as { [key: number]: TransactionSplitsType },
	);

	// Combine transactions with transaction splits and correct categories
	if ('error' in transactions) {
		throw new Error(transactions.error?.message);
	}
	const combinedTransactions = transactions.transactions.map((transaction) => ({
		...transaction,
		transactionSplits: transactionSplitsMap[transaction.id].map((split: { category_id: number }) => ({
			...split,
			category: categoryMap.get(split.category_id) || 'Unknown',
		})),
	}));

	// TODO - might want to fix the type here
	return combinedTransactions as unknown as CombinedTransactionsType;
};
