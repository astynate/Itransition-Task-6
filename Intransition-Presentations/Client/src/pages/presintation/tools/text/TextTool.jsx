import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import SlideAPI from '../../api/SlideAPI';
import { useParams } from 'react-router-dom';

const TextTool = ({
        id, 
        propertiesValue,
        defaultText, 
        setToolbarOpenState, 
        headerRef,
        additionalStyles
    }) => {
    
    const [text, setText] = useState(defaultText);
    const [properties, setProperties] = useState(propertiesValue);
    const [defaultValue] = useState(text);
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [IsEditable, setEditableState] = useState(false);
    const [isActive, setActiveState] = useState(false);
    const ref = useRef();
    let params = useParams();

    useEffect(() => {
        setToolbarOpenState(isActive);
    }, [isActive]);

    const handleMouseDown = (e, coefficientX, coefficientY, isFreezedX, isFreezedY) => {
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;

        const handleMouseMove = (e) => {
            if (isActive) {
                const offsetX = e.clientX - startX;
                const offsetY = e.clientY - startY;
    
                setProperties({
                    ...properties,
                    width: properties.width + coefficientX * offsetX,
                    height: properties.height + coefficientY * offsetY,
                    top: isFreezedY === false ? properties.top + offsetY : properties.top,
                    left: isFreezedX === false ? properties.left + offsetX : properties.left
                });
            }
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleDragStart = (e) => {
        if (IsEditable) { return; }

        setIsDragging(true);
        setStartPosition({ x: e.clientX - properties.left, y: e.clientY - properties.top });
        
        e.preventDefault();
    };

    const handleDragMove = (e) => {
        if (isDragging) {
            setProperties({
                ...properties,
                left: e.clientX - startPosition.x,
                top: e.clientY - startPosition.y
            });
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleInput = (event) => {
        setText(event.target.innerText);
    };

    useEffect(() => {
        console.log(additionalStyles);
    }, [additionalStyles]);

    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }

            if (headerRef.current && (event.target === headerRef.current || headerRef.current.contains(event.target))) {
                return;
            }

            if (isActive === true) {
                setEditableState(false);
                setActiveState(false);

                SlideAPI.AddTextOrUpdate(
                    {
                        presentationId: params.id,
                        slideId: "00000000-0000-0000-0000-000000000000", 
                        text: text, 
                        height: Math.floor(properties.height), 
                        width: Math.floor(properties.width),
                        top: Math.floor(properties.top),
                        left: Math.floor(properties.left),
                        ...additionalStyles
                    },
                    true,
                    id
                );
            }
        };

        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref, headerRef, isActive, text, properties, additionalStyles]);

    useEffect(() => {
        const listener = (event) => {
            setEditableState(editable => {
                setActiveState(prev => {
                    if (event.key === 'Backspace' && prev && editable === false) {
                        SlideAPI.DeleteText(params.id, id);
                    }
    
                    return prev;
                });

                return editable;
            })
        };

        document.addEventListener('keydown', listener);

        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, []);

    return (
        <div 
            className={styles.textField} 
            style={properties}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseLeave={handleDragEnd}
            onMouseUp={handleDragEnd}
            onClick={() => setActiveState(true)}
            state={isActive ? "active" : null}
            ref={ref}
        >
            {isActive &&
                <>
                    <div className={styles.resizeBox} onMouseDown={(e) => handleMouseDown(e, -1, -1, false, false)}></div>
                    <div className={styles.resizeBox} onMouseDown={(e) => handleMouseDown(e, -1, 1, false, true)}></div>
                    <div className={styles.resizeBox} onMouseDown={(e) => handleMouseDown(e, 1, -1, true, false)}></div>
                    <div className={styles.resizeBox} onMouseDown={(e) => handleMouseDown(e, 1, 1, true, true)}></div>
                </>}
            <span 
                contentEditable={IsEditable}
                onInput={handleInput}
                onDoubleClick={() => setEditableState(true)}
                state={IsEditable ? "edit" : null}
                suppressContentEditableWarning={true}
            >
                {defaultValue}
            </span>
        </div>
    );
};

export default TextTool;