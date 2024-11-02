// MainPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import Header from '../navigation/Header/Header';
import Footer from '../navigation/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const MainPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignUp = () => {
        navigate('/register');
    };

    const handleGitHub = () => {
        window.open('https://github.com/MltsKsenia', '_blank');
    };

    const handleLinkedin = () => {
        window.open('https://www.linkedin.com/in/mltsksenia/', '_blank');
    };

    return (
        <div className="main-page">
            <Header />
            <div className='page-container'>
                <div className='main-container'>
                    <h1>Home Share</h1>
                    <p>Our platform provides people with a convenient way to share useful items.</p>
                    <p>You can add your items to a shared catalog and reserve other's items that are available for common use.</p>
                    <div className="button-container">
                        <button onClick={handleLogin} className="main-button">Log In</button>
                        <button onClick={handleSignUp} className="main-button">Sign In</button>
                    </div>
                    <p>Or you can contact us</p>
                    <div className='contact'>
                        <button onClick={handleGitHub}><FontAwesomeIcon icon={faGithub} size="xl" /></button>
                        <button onClick={handleLinkedin}><FontAwesomeIcon icon={faLinkedin} size="xl" /></button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MainPage;
