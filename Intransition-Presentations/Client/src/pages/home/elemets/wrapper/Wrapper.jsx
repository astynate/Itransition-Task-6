import styles from './main.module.css';

const Wrapper = ({children}) => {
    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    );
}

export default Wrapper;