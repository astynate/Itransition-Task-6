import Avatar from '../../elemets/avatar/Avatar';
import styles from './main.module.css';

const Users = ({users = []}) => {
    return (
        <div className={styles.users}>
            {users.map((user) => {
                return (
                    <Avatar 
                        key={user.username}
                        name={user.username}
                        color={user.color}
                    />
                )
            })}
        </div>
    );
}

export default Users;