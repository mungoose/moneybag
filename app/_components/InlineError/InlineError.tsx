import styles from './InlineError.module.scss';
import cx from 'classnames';

type props = {
	visible: boolean;
	errorMessage?: string;
};

const InlineError = ({ visible, errorMessage }: props) => (
	<span className={cx(styles.error, { [styles.errorHide]: !visible })}>
		{errorMessage || ' hidden error message '}
	</span>
);

export default InlineError;
