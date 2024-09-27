import Button from '../../elements/button/Button';
import styles from './main.module.css';
import cursor from './images/cursor.png';
import text from './images/text.png';
import logo from './images/logo.png';
import Users from '../../../home/features/users/Users';
import textAlignCenter from './images/text-align-center.png';
import textAlignLeft from './images/text-align-left.png';
import textAlignRight from './images/text-align-right.png';
import bold from './images/bold.png';
import italics from './images/italics.png';
import underlined from './images/underline.png';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const Header = ({nameValue, presentation, users = [], currentTool, setTool, isToolBarOpen, headerRef, textStyles, setTextStyles}) => { 
    const [name, setName] = useState(nameValue);
    const [timer, setTimer] = useState(null);
    let params = useParams();
  
    const handleChange = (e) => {
      setName(e.target.value);
      
      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(() => {
        if (name.length > 0) {
            setName(prev => {
                let form = new FormData();

                form.append('name', prev);
                form.append('id', params.id);
                form.append('username', localStorage.getItem('username'));

                ChangeNameRequest(form);
                return prev;
            })
        } else {
            setName(nameValue);
        }
      }, 500);
      
      setTimer(newTimer);
    };

    const ChangeNameRequest = async (form) => {
        await fetch('/api/presentations', {
            method: "PUT",
            body: form
        });
    }
    
    const handleFontFamilyChange = (e) => {
        setTextStyles(prevStyles => ({ ...prevStyles, fontFamily: e.target.value }));
    };

    const handleFontSizeChange = (e) => {
        setTextStyles(prevStyles => ({ ...prevStyles, fontSize: e.target.value }));
    };

    const handleTextAlignChange = (align) => {
        setTextStyles(prevStyles => ({ ...prevStyles, textAlign: align }));
    };

    const handleTextStyleChange = (style) => {
        setTextStyles(prevStyles => ({ ...prevStyles, ...style }));
    };

    return (
        <div className={styles.headerWrapper} ref={headerRef}>
            <div className={styles.header} id={isToolBarOpen ? "open" : null}>
                <div className={styles.navigation}>
                    <Button 
                        image={logo} 
                    />
                    <Button 
                        image={cursor} 
                        isSelected={currentTool === 0} 
                        onClick={() => setTool(0)}
                    />
                    <Button 
                        image={text} 
                        isSelected={currentTool === 2}
                        onClick={() => setTool(2)} 
                    />
                </div>
                <input 
                    key={nameValue} 
                    defaultValue={nameValue ?? "Loading..."} 
                    maxLength={40} 
                    onInput={handleChange}
                />
                <div className={styles.users}>
                    <Users key={presentation} users={users} presentation={presentation} />
                </div>
            </div>
            <div className={styles.toolBar} id={isToolBarOpen ? "open" : null}>
                <div className={styles.items}>
                    <select value={textStyles.fontFamily} onChange={handleFontFamilyChange}>
                        <option>Tahoma</option>
                        <option>Verdana</option>
                        <option>Times New Roman</option>
                        <option>Georgia</option>
                        <option>Courier New</option>
                        <option>Brush Script MT</option>
                    </select>
                    <select value={textStyles.fontSize} onChange={handleFontSizeChange}>
                        <option>16px</option>
                        <option>24px</option>
                        <option>28px</option>
                        <option>32px</option>
                        <option>38px</option>
                        <option>62px</option>
                    </select>
                </div>
                <div className={styles.items}>
                    <div 
                        className={styles.button} 
                        id={textStyles.textAlign === 'left' ? 'active' : null}
                        type="radio" 
                        onClick={() => handleTextAlignChange('left')}
                    >
                        <img src={textAlignLeft} />
                    </div>
                    <div 
                        className={styles.button} 
                        type="radio" 
                        id={textStyles.textAlign === 'center' ? 'active' : null}
                        onClick={() => handleTextAlignChange('center')}
                    >
                        <img src={textAlignCenter} />
                    </div>
                    <div 
                        className={styles.button} 
                        type="radio"
                        id={textStyles.textAlign === 'right' ? 'active' : null}
                        onClick={() => handleTextAlignChange('right')}
                    >
                        <img src={textAlignRight} />
                    </div>
                </div>
                <div className={styles.items}>
                    <div 
                        className={styles.button} 
                        id={textStyles.fontWeight === '700' ? 'active' : null}
                        type="checkbox"
                        onClick={() => {
                            const style = textStyles.fontWeight === '700' ? '400' : '700';
                            handleTextStyleChange({fontWeight: style});
                        }}
                    >
                        <img src={bold} />
                    </div>
                    <div 
                        className={styles.button} 
                        id={textStyles.fontStyle === 'italic' ? 'active' : ''}
                        type="checkbox" 
                        onClick={() => {
                            const style = textStyles.fontStyle === 'italic' ? 'normal' : 'italic';
                            handleTextStyleChange({ fontStyle: style });
                        }}
                    >
                        <img src={italics} />
                    </div>
                    <div 
                        className={styles.button} 
                        id={textStyles.textDecoration === 'underline' ? 'active' : null}
                        type="checkbox" 
                        onClick={() => {
                            const style = textStyles.textDecoration === 'underline' ? 'none' : 'underline';
                            handleTextStyleChange({textDecoration: style});
                        }}
                    >
                        <img src={underlined} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;