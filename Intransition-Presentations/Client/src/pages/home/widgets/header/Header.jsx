import styles from './main.module.css';
import logo from './itransition_logo.svg';
import Wrapper from '../../elemets/wrapper/Wrapper';
import Avatar from '../../elemets/avatar/Avatar';
import { observer } from 'mobx-react-lite';
import userState from '../../../../state/userState';

const Header = observer(() => {
    return (
        <div className={styles.headerWrapper}>
            <Wrapper>
                <div className={styles.header}>
                    <div className={styles.left}>
                        <img src={logo} draggable="false" className={styles.logo} />
                        <h1 className={styles.company}>Itransition 
                            <div className={styles.product}>Presentations</div>
                        </h1>
                    </div>
                    <Avatar 
                        name={userState.username}
                        color={userState.color}
                    />
                </div>
            </Wrapper>
        </div>
    );
});

export default Header;