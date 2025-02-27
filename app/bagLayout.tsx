import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Moneybag',
	description: 'To have money in your bag, you need Moneybag',
};

type Props = {
	children: ReactNode;
	className?: string;
};

export default function BagLayout({ children, className }: Props) {
	return <div className={className}>{children}</div>;
}
