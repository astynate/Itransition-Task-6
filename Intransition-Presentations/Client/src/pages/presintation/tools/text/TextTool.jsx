import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';

const TextTool = ({width, height, top, left, defaultText}) => {
    const [text, setText] = useState(defaultText);
    const [properties, setProperties] = useState({ width: width, height: height, top: top, left: left });
    const [defaultValue] = useState(text);
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [IsEditable, setEditableState] = useState(false);
    const [isActive, setActiveState] = useState(false);
    const ref = useRef();

    const handleMouseDown = (e, coefficientX, coefficientY, isFreezedX, isFreezedY) => {
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;

        const handleMouseMove = (e) => {
            const offsetX = e.clientX - startX;
            const offsetY = e.clientY - startY;

            setProperties({ 
                width: properties.width + coefficientX * offsetX,
                height: properties.height + coefficientY * offsetY,
                top: isFreezedY === false ? properties.top + offsetY : properties.top,
                left: isFreezedX === false ? properties.left + offsetX : properties.left
            });
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
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }

            setEditableState(false);
            setActiveState(false);
        };

        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref]);

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