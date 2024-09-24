import styles from './main.module.css';

const List = ({children}) => {
    return (
        <div className={styles.templates}>
            {children}
        </div>
    );
}

export default List;