import styles from './main.module.css';

const Slide = ({number = 1, isCurrent = false}) => {
    return (
        <div className={styles.slideWrapper} state={isCurrent ? "current" : null}>
            <div className={styles.number}>
                <span>{number}</span>
            </div>
            <div className={styles.sheet}>
                
            </div>
        </div>
    )
}

export default Slide;