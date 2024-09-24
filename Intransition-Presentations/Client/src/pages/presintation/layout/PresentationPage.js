import React from 'react';
import styles from './main.module.css';
import Sheet from '../elements/sheet/Sheet';
import Header from '../widgets/header/Header';
import Slide from '../elements/slide/Slide';
import add from './images/add.svg';
import { createSignalRContext } from "react-signalr/signalr";

export const signalrContext = createSignalRContext();

const PresentationPage = () => {
    return (
        <signalrContext.Provider url={'http://localhost:5000/user-hub'}>
            <div className={styles.wrapper}>
                <title>Itransition Task 6</title>
                <Header />
                <div className={styles.content}>
                    <div className={styles.left}>
                        <div className={styles.slides}>
                            <Slide number={1} isCurrent={true} />
                        </div>
                        <div className={styles.create}>
                            <img src={add} draggable="false" />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.editor}>
                            <Sheet />
                        </div>
                        <div className={styles.control}>
                            <span>Slide 1 of 10</span>
                        </div>
                    </div>
                </div>
            </div>
        </signalrContext.Provider>
    );
}

export default PresentationPage;
