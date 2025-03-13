import { supabase } from './supabaseClient';
import type { TransactionItemType } from '@/types/transactions';

export const addTransaction = async (transaction: TransactionItemType) => {
	const { id, payee, date, transactionSplits } = transaction;

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
		transactionSplitOutFlow: split.transactionSplitOutflow,
		transactionSplitInflow: split.transactionSplitInflow,
		memo: split.memo,
	}));

	const { error: splitsError } = await supabase.from('transaction_splits').insert(splits);

	if (splitsError) {
		console.error('Error adding transaction splits: ', splitsError);
		return { error: splitsError };
	}

	return { success: true };
};
