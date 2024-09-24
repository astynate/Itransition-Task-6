import styles from './main.module.css';

const Button = ({image, isSelected, onClick}) => {
    return (
        <button 
            className={styles.button} 
            state={isSelected ? "selected" : null}
            onClick={onClick}
        >
            <img src={image} draggable="false" />
        </button>
    );
}

export default Button;