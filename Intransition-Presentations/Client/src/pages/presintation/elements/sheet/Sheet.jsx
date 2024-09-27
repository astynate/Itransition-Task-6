import { useRef } from 'react';
import TextTool from '../../tools/text/TextTool';
import styles from './main.module.css';
import SlideAPI from '../../api/SlideAPI';
import { useParams } from 'react-router-dom';

const Sheet = ({
        currentTool, 
        setTool, 
        slide={}, 
        setToolbarOpenState, 
        headerRef, 
        textStyles={}, 
        setAdditionalStyles,
        isEditable = true
    }) => {

    const ref = useRef();
    let params = useParams();

    const TextToolHandler = (event) => {
        const sheetRect = ref.current.getBoundingClientRect();

        SlideAPI.AddTextOrUpdate({
            presentationId: params.id,
            slideId: slide.id, 
            text: "Enter text...", 
            height: 100, 
            width: 100,
            top: Math.floor(event.clientY - sheetRect.top),
            left: Math.floor(event.clientX - sheetRect.left),
            sheetHeight: Math.floor(sheetRect.height),
            sheetWidth: Math.floor(sheetRect.width),
            ...textStyles
        });
    }

    const handlers = [() => {}, () => {}, TextToolHandler]

    const ClickHandler = (event) => {
        if (isEditable) {
            handlers[currentTool](event);
            setTool(0);
        }
    }

    return (
        <div onClick={ClickHandler} ref={ref} className={styles.sheet} tool={`tool-${currentTool}`}>
            {slide.texts && slide.texts.map(element => {
                return (
                    <TextTool 
                        id={element.id}
                        key={
                            element.id + 
                            element.text + 
                            element.height + 
                            element.width + 
                            element.top + 
                            element.left + 
                            element.fontFamily + 
                            element.fontSize +
                            element.fontStyle +
                            element.fontWeight + 
                            element.textAlign +
                            element.textDecoration +
                            element.sheetHeight +
                            element.sheetWidth
                        }
                        propertiesValue={element}
                        additionalStyles={textStyles}
                        defaultText={element.text}
                        setToolbarOpenState={setToolbarOpenState}
                        headerRef={headerRef}
                        setAdditionalStyles={setAdditionalStyles}
                        sheetRef={ref}
                        isCanBeEditable={isEditable}
                    />
                )
            })}
        </div>
    );
}

export default Sheet;