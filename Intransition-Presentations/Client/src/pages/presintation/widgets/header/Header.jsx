import Button from '../../elements/button/Button';
import styles from './main.module.css';
import cursor from './images/cursor.png';
import text from './images/text.png';
import logo from './images/logo.png';
import figure from './images/figure.png';
import Users from '../../../home/features/users/Users';
import { useState } from 'react';

const Header = () => {
    const [currentTool, setTool] = useState(0);

    return (
        <div className={styles.header}>
            <div className={styles.navigation}>
                <Button 
                    image={logo} 
                />
                <Button 
                    image={cursor} 
                    isSelected={currentTool === 0} 
                    onClick={() => setTool(0)}
                />
                {/* <Button 
                    image={figure} 
                    isSelected={currentTool === 1} 
                    onClick={() => setTool(1)}
                /> */}
                <Button 
                    image={text} 
                    isSelected={currentTool === 2}
                    onClick={() => setTool(2)} 
                />
            </div>
            <div className={styles.name}>
                <input defaultValue={"File name"} />
            </div>
            <div className={styles.users}>
                <Users />
            </div>
        </div>
    );
}

export default Header;