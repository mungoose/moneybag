import { supabase } from './supabaseClient';
import type { TransactionItemType } from '@/types/transactions';

export const addTransaction = async (transaction: TransactionItemType) => {
	const { id, payee, date, transactionSplits } = transaction;

	console.log('...... transaction: ', transaction);

	// insert the transaction
	const { data: transactionData, error: transactionError } = await supabase
		.from('transactions')
		.insert([{ id, payee, date }])
		.select();

	if (transactionError) {
		console.error('Error adding transaction: ', transactionError);
		return { error: transactionError };
	}

	// insert the transaction splits
	const transactionId = transactionData[0].id;
	const splits = transactionSplits.map((split) => ({
		transaction_id: transactionId,
		category_id: split.categoryId,
		outflow: split.transactionSplitOutflow === '' ? 0 : split.transactionSplitOutflow,
		inflow: split.transactionSplitInflow === '' ? 0 : split.transactionSplitInflow,
		memo: split.memo,
	}));

	const { error: splitsError } = await supabase.from('transaction_splits').insert(splits);

	if (splitsError) {
		console.error('Error adding transaction splits: ', splitsError);

		// rollback the transaction as well
		const { error: rollbackError } = await supabase.from('transactions').delete().eq('id', transactionId);

		if (rollbackError) {
			console.error('Error rolling back transaction: ', rollbackError);
			return { error: rollbackError };
		}

		return { error: splitsError };
	}

	console.log('..... added transaction and splits: ', transaction);

	return { success: true };
};

export const getTransactions = async () => {
	const { data: transactions, error } = await supabase
		.from('transactions')
		.select('*')
		.order('date', { ascending: false })
		.order('id', { ascending: false });

	if (error) {
		console.error('Error fetching transactions: ', error);
		return { error };
	}

	return { transactions };
};

export const getTransactionSplits = async () => {
	const { data: transactionSplits, error } = await supabase.from('transaction_splits').select('*');

	if (error) {
		console.error('Error fetching transaction splits: ', error);
		return { error };
	}

	return { transactionSplits };
};

export const getCategories = async () => {
	const { data: categories, error } = await supabase.from('categories').select('*');

	if (error) {
		console.error('Error fetching categories: ', error);
		return { error };
	}

	return { categories };
};
