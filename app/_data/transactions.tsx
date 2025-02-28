import type { TransactionsType } from '../_types/transactions';

export const transactions: TransactionsType = [
	{
		id: 1,
		payee: 'Selver',
		categorySplit: [
			{
				category: 'Söök/jook',
				categorySplitOutflow: 100,
				categorySplitInflow: 0,
				memo: '',
			},
		],
	},
	{
		id: 2,
		payee: 'Delice',
		categorySplit: [
			{
				category: 'Söök/jook',
				categorySplitOutflow: 75,
				categorySplitInflow: 0,
				memo: '',
			},
		],
	},
	{
		id: 3,
		payee: 'Selver',
		categorySplit: [
			{
				category: 'Kodu',
				categorySplitOutflow: 7.4,
				categorySplitInflow: 0,
				memo: 'Siia mingi hästi pikk jutt, mis võiks normaalselt ära mahtuda',
			},
		],
	},
	{
		id: 4,
		payee: 'Delice',
		categorySplit: [
			{
				category: 'Söök/jook',
				categorySplitOutflow: 5,
				categorySplitInflow: 0,
				memo: '',
			},
			{
				category: 'Söök/jook',
				categorySplitOutflow: 115,
				categorySplitInflow: 0,
				memo: '',
			},
		],
	},
	{
		id: 5,
		payee: 'Eveli',
		categorySplit: [
			{ category: 'Kodu', categorySplitOutflow: 650, categorySplitInflow: 0, memo: '' },
			{
				category: 'Kodu',
				categorySplitOutflow: 0,
				categorySplitInflow: 15,
				memo: 'Telia mobiilne',
			},
		],
	},
];
