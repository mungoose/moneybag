import type { TransactionsType } from '../_types/transactions';

export const transactions: TransactionsType = [
	{
		id: 1,
		payee: 'Selver',
		categorySplit: [
			{
				mainCategory: 'Söök/jook',
				subCategory: 'Snäkid',
				subCategoryOutflow: 100,
				subCategoryInflow: 0,
				memo: '',
			},
		],
	},
	{
		id: 2,
		payee: 'Delice',
		categorySplit: [
			{
				mainCategory: 'Söök/jook',
				subCategory: 'Alkohol',
				subCategoryOutflow: 75,
				subCategoryInflow: 0,
				memo: '',
			},
		],
	},
	{
		id: 3,
		payee: 'Selver',
		categorySplit: [
			{
				mainCategory: 'Kodu',
				subCategory: 'Kodutarbed',
				subCategoryOutflow: 7.4,
				subCategoryInflow: 0,
				memo: 'Siia mingi hästi pikk jutt, mis võiks normaalselt ära mahtuda',
			},
		],
	},
	{
		id: 4,
		payee: 'Delice',
		categorySplit: [
			{
				mainCategory: 'Söök/jook',
				subCategory: 'Alkohol',
				subCategoryOutflow: 5,
				subCategoryInflow: 0,
				memo: '',
			},
			{
				mainCategory: 'Söök/jook',
				subCategory: 'Snäkid',
				subCategoryOutflow: 115,
				subCategoryInflow: 0,
				memo: '',
			},
		],
	},
	{
		id: 5,
		payee: 'Eveli',
		categorySplit: [
			{ mainCategory: 'Kodu', subCategory: 'Kodulaen', subCategoryOutflow: 650, subCategoryInflow: 0, memo: '' },
			{
				mainCategory: 'Kodu',
				subCategory: 'Internet',
				subCategoryOutflow: 0,
				subCategoryInflow: 15,
				memo: 'Telia mobiilne',
			},
		],
	},
];
