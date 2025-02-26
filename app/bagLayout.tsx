import type { ReactNode } from 'react';
import Head from 'next/head';

type Props = {
	children: ReactNode;
	className?: string;
};

export default function BagLayout({ children, className }: Props) {
	return (
		<>
			<Head>
				<title>Moneybag</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<div className={className}>{children}</div>
		</>
	);
}
