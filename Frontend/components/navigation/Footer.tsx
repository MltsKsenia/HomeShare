import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/home');
    };

    const handleAddItemClick = () => {
        navigate('/add-item');
    };

    const handleProfileClick = () => {
        navigate('/my-profile');
    };

    return (
        <footer className="bottom-nav">
            <div>
                <button className="nav-button" onClick={handleHomeClick}>🏠</button>
                <button className="add-button" onClick={handleAddItemClick}>➕</button>
                <button className="nav-button" onClick={handleProfileClick}>👤</button>
            </div>
        </footer>
    );
};

export default Footer;