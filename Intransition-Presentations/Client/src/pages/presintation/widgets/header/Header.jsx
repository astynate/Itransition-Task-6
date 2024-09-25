import Button from '../../elements/button/Button';
import styles from './main.module.css';
import cursor from './images/cursor.png';
import text from './images/text.png';
import logo from './images/logo.png';
import Users from '../../../home/features/users/Users';
import { useState } from 'react';

const Header = ({name, users = [], currentTool, setTool}) => {
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
                <input key={name} defaultValue={name ?? "Loading..."} />
            </div>
            <div className={styles.users}>
                <Users users={users} />
            </div>
        </div>
    );
}

export default Header;