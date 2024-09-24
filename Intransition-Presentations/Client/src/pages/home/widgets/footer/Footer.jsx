import Wrapper from '../../elemets/wrapper/Wrapper';
import styles from './main.module.css';

const Footer = () => {
    return (
        <div className={styles.footerWrapper}>
            <Wrapper>
                <span>© Andreev S, 2024 — Minsk, Belarus.</span>
            </Wrapper>
        </div>
    );
}

export default Footer;