import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import Header from '../widgets/header/Header';
import Create from '../widgets/create/Create';
import Wrapper from '../elemets/wrapper/Wrapper';
import powerPointFile from './images/powerpoint-file-logo.png';
import './main.css';
import DateHandler from '../../../utils/DateHandler';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [presentations, setPresentations] = useState([]);

    useEffect(() => {
        const Fetch = async () => {
            await fetch('/api/presentations')
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    setPresentations(response);
                });
        }

        Fetch();
    }, []);

    return (
        <div className={styles.wrapper}>
            <title>Itransition Presintations</title>
            <Header />
            <Create setPresentations={setPresentations} />
            <div className={styles.presentations}>
                <Wrapper>
                    <div className={styles.tableWrapper}>
                        <div className={styles.elements}>
                            <h3>Name</h3>
                            <h3>Creation date</h3>
                            <h3>Owner</h3>
                        </div>
                        {presentations.map(presentation => {
                            return (
                                <Link 
                                    to={`/presentation/${presentation.id}`}
                                    className={styles.elements} 
                                    key={presentation.id}
                                >
                                    <div className={styles.name}>
                                        <img src={powerPointFile} />
                                        <h3>{presentation.name}</h3>
                                    </div>
                                    <h3>{DateHandler.Format(presentation.date)}</h3>
                                    <h3>{presentation.owner}</h3>
                                </Link>
                            );
                        })}
                    </div>
                </Wrapper>
            </div>
        </div>
    );
}

export default HomePage;
