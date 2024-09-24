import { useState } from 'react';
import styles from './main.module.css';
import userState from '../../state/userState';

const Login = () => {
    const [name, setName] = useState('');
    const [color, setColor] = useState(0);

    const SendLoginReqest = async () => {
        if (name == '' || !name) {
            alert('Name is required');
            return;
        }

        let form = new FormData();

        form.append('nickname', name);
        form.append('color', color);

        await fetch('api/users', {
            method: "POST",
            body: form
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('username', data.username);
            localStorage.setItem('color', data.color);

            userState.SetUserData(data.username, data.color);
        })
        .catch(error => {
            alert(error);
        });
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.login}>
                <h2 className={styles.title}>Itransition ID</h2>
                <input 
                    placeholder='Nickaname'
                    value={name}
                    autoFocus
                    onInput={(e) => setName(e.target.value)}
                />
                <div className={styles.colors}>
                    <div 
                        className={styles.color} 
                        id={color === 0 ? 'active' : null}
                        onClick={() => setColor(0)}
                    ></div>
                    <div 
                        className={styles.color} 
                        id={color === 1 ? 'active' : null}
                        onClick={() => setColor(1)}
                    ></div>
                    <div 
                        className={styles.color} 
                        id={color === 2 ? 'active' : null}
                        onClick={() => setColor(2)}
                    ></div>
                </div>
                <button
                    onClick={() => SendLoginReqest()}
                >Login</button>
            </div>
        </div>
    )
}

export default Login;