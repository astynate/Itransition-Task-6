import { useState } from 'react';
import styles from './main.module.css';

const PresentationTemplate = ({name = 'Empty', image, onClick = () => {}}) => {
    const [isCreateButtonOpen, setCreateButtonState] = useState(!(!!image));

    return (
        <div 
            className={styles.presentationTemplate} 
            onMouseEnter={() => setCreateButtonState(true)}
            onMouseLeave={() => setCreateButtonState(false)}
            onClick={onClick}
        >
            <div className={styles.image}>
                {(isCreateButtonOpen || !(!!image))&& 
                    <div className={styles.create}>
                        <div className={styles.line} />
                        <div className={styles.line} />
                    </div>}
                {image && <img src={image} draggable="false" />}
            </div>
            <span className={styles.name}>{name}</span>
        </div>
    );
}

export default PresentationTemplate;