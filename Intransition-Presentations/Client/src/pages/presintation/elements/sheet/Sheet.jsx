import { useEffect, useRef, useState } from 'react';
import TextTool from '../../tools/text/TextTool';
import styles from './main.module.css';
import SlideAPI from '../../api/SlideAPI';
import { useParams } from 'react-router-dom';

const Sheet = ({currentTool, setTool, slide={}, setToolbarOpenState, headerRef, textStyles={}}) => {
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
            ...textStyles
        });
    }

    const handlers = [() => {}, () => {}, TextToolHandler]

    const ClickHandler = (event) => {
        handlers[currentTool](event);
        setTool(0);
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
                            element.left
                        }
                        propertiesValue={{ 
                            width: element.width, 
                            height: element.height, 
                            top: element.top, 
                            left: element.left,
                            fontSize: element.fontSize,
                            fontStyle: element.fontStyle,
                            fontWeight: element.fontWeight,
                            textAlign: element.textAlign,
                            textDecoration: element.textDecoration,
                        }}
                        additionalStyles={textStyles}
                        defaultText={element.text}
                        setToolbarOpenState={setToolbarOpenState}
                        headerRef={headerRef}
                    />
                )
            })}
        </div>
    );
}

export default Sheet;