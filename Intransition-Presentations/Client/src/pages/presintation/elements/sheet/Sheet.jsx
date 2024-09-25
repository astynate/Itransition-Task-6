import { useRef, useState } from 'react';
import TextTool from '../../tools/text/TextTool';
import styles from './main.module.css';

const Sheet = ({currentTool, setTool, textsValue = []}) => {
    const ref = useRef();
    const [texts, setTexts] = useState(textsValue);

    const TextToolHandler = (event) => {
        const sheetRect = ref.current.getBoundingClientRect();

        setTexts(prev => [...prev, {
            width: 100,
            height: 100,
            top: event.clientY - sheetRect.top,
            left: event.clientX - sheetRect.left,
        }]);
    }

    const handlers = [() => {}, () => {}, TextToolHandler]

    const ClickHandler = (event) => {
        handlers[currentTool](event);
        setTool(0);
    }

    return (
        <div onClick={ClickHandler} ref={ref} className={styles.sheet} tool={`tool-${currentTool}`}>
            {texts.map((element, index) => {
                return (
                    <TextTool 
                        key={index}
                        defaultText={"Hello"}
                        width={element.width} 
                        height={element.height} 
                        top={element.top} 
                        left={element.left} 
                    />
                )
            })}
        </div>
    );
}

export default Sheet;