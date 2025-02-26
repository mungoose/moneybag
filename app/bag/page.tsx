import BagLayout from '../bagLayout';
import InputForm from '@/components/InputForm/InputForm';
import styles from '../page.module.scss';

const Bag = () => {
	return (
		<BagLayout className={styles.page}>
			<h1>Bag</h1>
			<InputForm />
		</BagLayout>
	);
};

export default Bag;
