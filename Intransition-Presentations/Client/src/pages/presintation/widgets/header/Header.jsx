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
import underlined from './images/text-align-right.png';

const Header = ({name, users = [], currentTool, setTool, isToolBarOpen, headerRef, setTextStyles}) => { 
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
        setTextStyles(prevStyles => ({ ...prevStyles, [style]: !prevStyles[style] }));
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
                <div className={styles.name}>
                    <input key={name} defaultValue={name ?? "Loading..."} />
                </div>
                <div className={styles.users}>
                    <Users users={users} />
                </div>
            </div>
            <div className={styles.toolBar} id={isToolBarOpen ? "open" : null}>
                <div className={styles.items}>
                    <select onChange={handleFontFamilyChange}>
                        <option>Open-Sans</option>
                        <option>Helvetica</option>
                        <option>Times New Roman</option>
                    </select>
                    <select onChange={handleFontSizeChange}>
                        <option>10%</option>
                        <option>20%</option>
                        <option>30%</option>
                        <option>40%</option>
                        <option>50%</option>
                        <option>60%</option>
                    </select>
                </div>
                <div className={styles.items}>
                    <div className={styles.button} id='active' type="radio" onClick={() => handleTextAlignChange('left')}>
                        <img src={textAlignLeft} />
                    </div>
                    <div className={styles.button} type="radio" onClick={() => handleTextAlignChange('center')}>
                        <img src={textAlignCenter} />
                    </div>
                    <div className={styles.button} type="radio" onClick={() => handleTextAlignChange('right')}>
                        <img src={textAlignRight} />
                    </div>
                </div>
                <div className={styles.items}>
                    <div className={styles.button} id='active' type="checkbox" onClick={() => handleTextStyleChange('fontWeight')}>
                        <img src={bold} />
                    </div>
                    <div className={styles.button} type="checkbox" onClick={() => handleTextStyleChange('fontStyle')}>
                        <img src={italics} />
                    </div>
                    <div className={styles.button} type="checkbox" onClick={() => handleTextStyleChange('textDecoration')}>
                        <img src={underlined} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;