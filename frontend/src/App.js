import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectModal from './ProjectModal';
import ProjectComponentsPage from './ProjectComponentsPage';
import Signup from './Signup';
import Login from './Login';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonPage from './Button/ButtonPage';
import Components from './Components/Components';


// Function to get the token from cookies
const getTokenFromCookies = () => {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

// Function to check token expiry
const isTokenExpired = (token) => {
    if (!token) {
        return true;
    }
    try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return exp < currentTime;
    } catch (e) {
        return true;
    }
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLoginSuccess = (token) => {
        setIsAuthenticated(true);
        startSessionTimer(token);
    };

    const startSessionTimer = (token) => {
        try {
            // const { exp } = JSON.parse(atob(token.split('.')[1]));
            // const currentTime = Date.now() / 1000;
            // const timeout = (exp - currentTime) * 1000;
            setTimeout(() => {
                handleLogout();
            }, 7200000);
        } catch (error) {
            console.error("Error starting session timer:", error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/logout');
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            setIsAuthenticated(false);
            toast.warning('Session expired. Please log in again.');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    useEffect(() => {
        const token = getTokenFromCookies();
        if (token && !isTokenExpired(token)) {
            setIsAuthenticated(true);
            startSessionTimer(token);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading state while checking the token
    }

    return (
        <Routes>
           {/* //<Route path="/" element={<Navigate to={isAuthenticated ? "/ProjectModal" : "/login"} />} /> */}
            <Route path='/' element={<ProjectModal/>}/>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/projects/:projectName" element={ <ProjectComponentsPage /> } />
            {/* <Route path="/ProjectModal" element={isAuthenticated ? <ProjectModal /> : <Navigate to="/login" />} /> */}
            <Route path="/ProjectModal" element={<ProjectModal/>} />
            <Route path='/ButtonPage' element={<ButtonPage/>}/>
            <Route path='/Components' element={<Components/>}/>
        </Routes>
    );
}

export default App;
