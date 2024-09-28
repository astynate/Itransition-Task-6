import { useEffect, useRef, useState } from 'react';
import userState from '../../../../state/userState';
import Avatar from '../../elemets/avatar/Avatar';
import styles from './main.module.css';
import { useParams } from 'react-router-dom';

export const IsUserHasEditPermission = (presentation, user) => {
    if (presentation.owner === user.username) {
        return true;
    }

    if (presentation.permissions && presentation.permissions.includes) {
        return presentation.permissions
            .filter(e => e.permission === 'ReadAndEdit')
            .map(e => e.username)
            .includes(user.username);
    }

    return false;
}

const Users = ({users = [], presentation}) => {
    const [isOpen, setOpenState] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]); 

    let ref = useRef();
    let params = useParams();

    const HandlePermissionChange = async (value, index) => {
        let form = new FormData();

        form.append('id', params.id);
        form.append('permission', value === "Visitor" ? "ReadOnly" : "ReadAndEdit");
        form.append('username', localStorage.getItem('username'));
        form.append('user', users[index].username);

        await fetch('/api/presentation/permissions', {
            method: "PUT",
            body: form
        });
    }

    useEffect(() => {
        setUserPermissions(prev => {
            for (let i = 0; i < users.length; i++) {
                prev[i] = IsUserHasEditPermission(presentation, users[i]);
            }
            return { ...prev };
        });
    }, [users, presentation, presentation.permissions]);

    useEffect(() => {
        const ClosePopUpWindow = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpenState(false);
            }
        }
    
        window.addEventListener('click', ClosePopUpWindow);
    
        return () => {
            window.removeEventListener('click', ClosePopUpWindow);
        }
    }, [ref]);

    return (
        <div className={styles.users} ref={ref}>
            <div className={styles.avatars} onClick={() => setOpenState(prev => !prev)}>
                {users.slice(0, 3).map((user) => {
                    return (
                        <Avatar 
                            key={user.username}
                            name={user.username}
                            color={user.color}
                        />
                    )
                })}
            </div>
            {isOpen && <div className={styles.usersPopUp} key={userPermissions.length + userPermissions}>
                {users.map((user, index) => {
                    return (
                        <div className={styles.user} key={user.username + presentation}>
                            <Avatar 
                                name={user.username}
                                color={user.color}
                            />
                            <span className={styles.username}>{user.username}</span>
                            <div className={styles.role}>
                                {presentation.owner === user.username ?
                                    <span>Owner</span>
                                :
                                    presentation.owner === userState.username ?
                                        <select 
                                            value={userPermissions[index] ? "Editor" : "Visitor"} 
                                            onChange={(event) => HandlePermissionChange(event.target.value, index)}
                                        >
                                            <option>Visitor</option>
                                            <option>Editor</option>
                                        </select>
                                    :
                                        <span>{userPermissions[index] ? "Editor" : "Visitor"}</span>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>}
        </div>
    );
}

export default Users;