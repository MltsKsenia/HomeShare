// ItemCard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ItemCardData, ProfileFormData } from '../src/types/types';
import Header from './navigation/Header';
import Footer from './navigation/Footer';

const ItemCard: React.FC = () => {
    const [itemData, setItemData] = useState<ItemCardData | null>(null);
    const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const itemId = localStorage.getItem('itemID');
        console.log("Fetched item ID from localStorage:", itemId);  // Debug log

        if (itemId) {
            axios.get<ItemCardData>(`http://localhost:3000/api/items/${itemId}`)
                .then(response => {
                    console.log("Response status:", response.status);  // Debug log
                    console.log("Fetched item data:", response.data);
                    setItemData(response.data);

                    if (response.data.user_id) {
                        console.log("User ID found in item data:", response.data.user_id);
                        return axios.get<ProfileFormData>(`http://localhost:3000/api/user/profile/${response.data.user_id}`);
                    } else {
                        console.warn("User ID not found in item data.");
                        return Promise.reject('User ID not found');
                    }
                })
                .then(profileResponse => {
                    console.log("Fetched profile data:", profileResponse.data);
                    setProfileData(profileResponse.data);
                })
                .catch(error => console.error("Error fetching data:", error));
        } else {
            console.warn("Item ID not found in localStorage.");
        }
    }, []);

    const handleReserve = async () => {
        const itemId = localStorage.getItem('itemID');
        if (!itemId || !startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }

        const reservationData = {
            itemId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };

        try {
            await axios.post('http://localhost:3000/api/reservations', reservationData);
            setSuccess("Reservation request sent successfully!");
            setError(null);
            localStorage.setItem(`reservation_${itemId}`, JSON.stringify(reservationData));
        } catch (error) {
            console.error("Error reserving item:", error);
            setError("Failed to send reservation request. Please try again.");
            setSuccess(null);
        }
    };

    if (!itemData) return <p>Loading...</p>;

    return (
        <div className="item-card">
            <Header />
            {/* Item Data */}
            <div className='card'>
                {itemData.image_url && <img src={itemData.image_url} alt={itemData.name} />}
                <h3>{itemData.name}</h3>
                <p>{itemData.description}</p>
                <p>{itemData.category}</p>

                {/* Profile Data */}
                {profileData && (
                    <div className="profile-info">
                        <h4>Posted by: {profileData.full_name}</h4>
                        <p>Phone: {profileData.phone_number}</p>
                        <p>Address: {profileData.address}</p>
                        {profileData.profile_image_url && (
                            <img src={profileData.profile_image_url} alt="Profile" />
                        )}
                    </div>
                )}

                <div className="date-picker-container">
                    <h4>Select Reservation Dates</h4>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date || undefined)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date || undefined)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="End Date"
                    />
                    <button onClick={handleReserve}>Reserve</button>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ItemCard;