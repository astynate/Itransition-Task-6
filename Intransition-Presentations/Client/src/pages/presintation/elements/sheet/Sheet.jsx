import { useState } from 'react';
import TextTool from '../../tools/text/TextTool';
import styles from './main.module.css';

const Sheet = () => {
    const [text, setText] = useState("dasd");

    return (
        <div className={styles.sheet}>
            {/* <TextTool text={text} setText={setText} /> */}
        </div>
    );
}

export default Sheet;