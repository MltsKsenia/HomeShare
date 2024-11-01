import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faShop } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Footer: React.FC = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleCatalogClick = () => {
        navigate('/catalog');
    };

    const handleAddItemClick = () => {
        navigate('/add-item');
    };

    const handleItemsClick = () => {
        navigate('/my-items');
    };

    const handleOrdersClick = () => {
        navigate('/my-orders');
    };

    return (
        <footer className="bottom-nav">
            <div>
                <button className="nav-button" onClick={handleHomeClick}><FontAwesomeIcon icon={faHouse} size="lg" /></button>
                <button className="nav-button" onClick={handleCatalogClick}><FontAwesomeIcon icon={faShop} size="lg" /></button>
                <button className="add-button" onClick={handleAddItemClick}><FontAwesomeIcon icon={faPlus} size="lg" /></button>
                <button className="nav-button" onClick={handleItemsClick}><FontAwesomeIcon icon={faFolderOpen} size="lg" /></button>
                <button className="nav-button" onClick={handleOrdersClick}><FontAwesomeIcon icon={faBell} size="lg" /></button>
            </div>
        </footer>
    );
};

export default Footer;