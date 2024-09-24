import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../src/pages/home/layout/HomePage';
import PresintationPage from '../src/pages/presintation/layout/PresentationPage';
import Login from './elements/login/Login';
import { observer } from 'mobx-react-lite';
import userState from './state/userState';

const App = observer(() => {
    const [isLoggedIn, setLogginState] = useState(true);

    useEffect(() => {
        const username = localStorage.getItem('username');
        const color = localStorage.getItem('color');

        setLogginState(!!username && !!color);
        userState.SetUserData(username, color);
    }, [userState.username]);

    return (
        <>
            {isLoggedIn === false && <Login />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/presentation/:id" element={<PresintationPage />} />
                <Route path="*" element={<h1>404 - Not Found</h1>} />
            </Routes>
        </>
    );
});

export default App;