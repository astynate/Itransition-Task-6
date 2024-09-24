import Avatar from '../../elemets/avatar/Avatar';
import styles from './main.module.css';

const Users = () => {
    return (
        <div className={styles.users}>
            <Avatar />
            <Avatar />
            <Avatar />
        </div>
    );
}

export default Users;