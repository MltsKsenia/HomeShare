import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../../../types/types';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshakeAngle } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            axios.get(`http://localhost:3000/api/user/${userId}`)
                .then(response => setUser(response.data))
                .catch(error => console.error("Error while retrieving user data:", error));
        }
    }, []);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate('/my-profile');
    };

    return (
        <header>
            <button className="header-button" onClick={handleHomeClick}>
                <FontAwesomeIcon icon={faHandshakeAngle} size="2xl" style={{ color: "#2b3469", }} />
                <div className="header-text">
                    <h1>Home Share</h1>
                    <p>Share your items with your neighbours!</p>
                </div>
            </button>
            <button className="profile-button" onClick={handleProfileClick}>
                <img
                    src={user?.profile_image_url && user.profile_image_url.startsWith('http')
                        ? user.profile_image_url
                        : 'https://i.pinimg.com/564x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg'}
                    alt="Profile"
                />
            </button>
        </header>
    );
};

export default Header;
