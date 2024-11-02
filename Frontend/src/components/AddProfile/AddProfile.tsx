// Profile.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProfileFormData } from '../../types/types';
import Header from '../navigation/Header/Header';
import Footer from '../navigation/Footer/Footer';

const Profile: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileFormData>({
        phone_number: '',
        full_name: '',
        address: '',
        profile_image_url: '',
        date_of_birth: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userIdStr = localStorage.getItem('userId');
            console.log("User ID from localStorage:", userIdStr);

            if (!userIdStr) {
                throw new Error('User ID not found. Please register again.');
            }

            const userId = parseInt(userIdStr, 10);
            if (isNaN(userId)) {
                throw new Error('Invalid user ID format. Please register again.');
            }

            await axios.post('http://localhost:3000/api/profile', { user_id: userId, ...profileData });
            setSuccessMessage('Profile updated successfully');
            setError(null);
            navigate('/catalog');
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'An error occurred while updating profile');
        }
    };


    return (
        <div>
            <Header />
            <h3>Optional Profile Information</h3>
            <form onSubmit={handleProfileSubmit}>
                <div>
                    <label htmlFor="phone_number">Phone Number:</label>
                    <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={profileData.phone_number}
                        onChange={handleProfileChange}
                    />
                </div>
                <div>
                    <label htmlFor="full_name">Full Name:</label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={profileData.full_name}
                        onChange={handleProfileChange}
                    />
                </div>
                <div>
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                    />
                </div>
                <div>
                    <label htmlFor="profile_image_url">Profile Image URL:</label>
                    <input
                        type="url"
                        id="profile_image_url"
                        name="profile_image_url"
                        value={profileData.profile_image_url}
                        onChange={handleProfileChange}
                    />
                </div>
                <div>
                    <label htmlFor="date_of_birth">Date of Birth:</label>
                    <input
                        type="date"
                        id="date_of_birth"
                        name="date_of_birth"
                        value={profileData.date_of_birth}
                        onChange={handleProfileChange}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <button type="submit">Save Profile</button>
            </form>
            <Footer />
        </div>
    );
};

export default Profile;