import type { Transactions } from '../_types/transactions';

export const transactions: Transactions = [
	{ sum: 100, payee: 'Selver', category: 'Food' },
	{ sum: 500, payee: 'Delice', category: 'Food' },
	{ sum: 175, payee: 'XS Mänguasjad', category: 'Mänguasjad', memo: 'Dinosaurus' },
	{
		sum: 175,
		payee: 'Bauhaus',
		category: 'Kodutarbed',
		memo: 'sdfdsf ad;lfjas flkajsd f;lkasdjf ldkjfdkjfldskfjdlkfj flkj ',
	},
];
