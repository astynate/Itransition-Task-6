import styles from './main.module.css';

const Avatar = ({name, color = 0}) => {
    return (
        <div className={styles.avatar} color={`color-${color}`}>
            {(name ?? "?")[0].toUpperCase()}
        </div>
    );
}

export default Avatar;