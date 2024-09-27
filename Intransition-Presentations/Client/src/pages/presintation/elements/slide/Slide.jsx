import Sheet from '../sheet/Sheet';
import styles from './main.module.css';

const Slide = ({number = 1, isCurrent = false, onClick = () => {}, slide}) => {
    return (
        <div 
            className={styles.slideWrapper} 
            state={isCurrent ? "current" : null}
            onClick={onClick}
        >
            <div className={styles.number}>
                <span>{number}</span>
            </div>
            <div className={styles.sheet}>
                <Sheet
                    key={slide}
                    slide={slide}
                    isEditable={false}
                />
            </div>
        </div>
    )
}

export default Slide;