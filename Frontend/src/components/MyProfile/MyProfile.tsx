// MyProfile.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, ProfileFormData, PasswordUpdateData } from '../../types/types';
import Header from '../navigation/Header/Header';
import Footer from '../navigation/Footer/Footer';
import './MyProfile.css';
import { useNavigate } from 'react-router-dom';

const MyProfile: React.FC = () => {
    const navigate = useNavigate();
    const imgbbApiKey = 'fd0f867a385e53a5721a13e32b2985fd';
    const [user, setUser] = useState<User | null>(null);
    const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
        currentPassword: '',
        newPassword: '',
    });
    const [userProfile, setUserProfile] = useState<ProfileFormData>({
        phone_number: '',
        full_name: '',
        address: '',
        profile_image_url: '',
        date_of_birth: '',
    });

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
            const imageUrl = response.data.data.url;
            setUserProfile((prev) => ({ ...prev, profile_image_url: imageUrl }));
            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            getUser(userId);
            getUserProfile(userId);
            console.log(`Updating user with ID: ${userId}`);
        } else {
            console.log("User ID not found in local storage.");
        }
    }, []);

    const getUser = async (userId: string) => {
        try {
            const response = await axios.get<User>(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to retrieve user data:', error);
        }
    };

    const getUserProfile = async (userId: string) => {
        try {
            const response = await axios.get<ProfileFormData>(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${userId}`);
            console.log('Profile data:', response.data);
            setUserProfile(response.data);
        } catch (error) {
            console.error('Failed to retrieve user profile:', error);
        }
    };

    const handleUpdateUser = async () => {
        if (user) {
            if (!user.username || !user.email) {
                alert('Username and email are required');
                return;
            }
            console.log("Updating user:", user);
            try {
                const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`, {
                    username: user.username,
                    email: user.email,
                });
                console.log("Response:", response.data);
                alert('User data updated successfully');
            } catch (error) {
                console.error('Failed to update user data:', error);
                alert('Error updating user data');
            }
        }
    };

    const handleUpdateUserProfile = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            console.log("Updating user profile for user ID:", userId);
            try {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}/profile`, userProfile);
                alert('User profile updated successfully');
            } catch (error) {
                console.error('Failed to update user profile:', error);
                alert('Error updating user profile');
            }
        }
    };

    const handlePasswordChange = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}/password`, passwordData);
                alert('Password updated successfully');
                setPasswordData({ currentPassword: '', newPassword: '' });
            } catch (error) {
                console.error('Failed to update password:', error);
                alert('Error updating password');
            }
        }
    };

    const handleDeleteUser = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");
            if (confirmDelete) {
                try {
                    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`);
                    alert(response.data.message);
                    navigate('/');
                } catch (error) {
                    console.error('Failed to delete user profile:', error);
                    alert('Error deleting user profile');
                }
            }
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post(`/api/logout`);
            alert(response.data.message);
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Failed to log out:', error);
            alert('Error logging out');
        }
    };

    return (
        <div>
            <Header />
            <div className='my-profile'>
                <h2>My Profile</h2>
                <div className='my-profile-card'>
                    <div>
                        <div className='basic-info'>
                            <h3>Basic Information</h3>
                            {user && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={user.username}
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    />
                                    <button onClick={handleUpdateUser}>Update Basic Info</button>
                                </>
                            )}
                        </div>

                        <div className='change-password'>
                            <h3>Change Password</h3>
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            />
                            <button onClick={handlePasswordChange}>Change Password</button>
                        </div>
                    </div>
                    <div className='profile-info'>
                        <h3>Profile Information</h3>
                        {userProfile && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={userProfile.phone_number}
                                    onChange={(e) => setUserProfile({ ...userProfile, phone_number: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={userProfile.full_name}
                                    onChange={(e) => setUserProfile({ ...userProfile, full_name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={userProfile.address}
                                    onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                                />
                                <div className="file-upload">
                                    <label htmlFor="fileInput" className="custom-file-upload">
                                        Upload Image
                                    </label>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                uploadImage(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    {userProfile.profile_image_url && (
                                        <img
                                            src={userProfile.profile_image_url}
                                            alt="Profile Thumbnail"
                                            className="profile-thumbnail"
                                        />
                                    )}
                                </div>
                                <p>Date of Birth:</p>
                                <p>Date of Birth:</p>
                                <input
                                    type="date"
                                    placeholder="Date of Birth"
                                    value={userProfile.date_of_birth ? userProfile.date_of_birth.substring(0, 10) : ''}
                                    onChange={(e) => setUserProfile({ ...userProfile, date_of_birth: e.target.value })}
                                />
                                <button onClick={handleUpdateUserProfile}>Update Profile Info</button>
                            </>
                        )}
                    </div>
                </div>
                <div className='profile-buttons'>
                    <button className="button-logout" onClick={handleLogout}>Log Out</button>
                    <button className="button-delete" onClick={handleDeleteUser}>Delete Profile</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyProfile;