// ItemCard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ItemCardData, ProfileFormData } from '../../types/types';
import Header from '../navigation/Header/Header';
import Footer from '../navigation/Footer/Footer';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './ItemCard.css';

const ItemCard: React.FC = () => {
    const { itemID } = useParams<{ itemID: string }>();
    const navigate = useNavigate();
    const [itemData, setItemData] = useState<ItemCardData | null>(null);
    const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [availableDays, setAvailableDays] = useState<[Date, Date] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const currentUserId = localStorage.getItem('userId');
    const isOwner = currentUserId !== null && Number(currentUserId) === itemData?.user_id;

    useEffect(() => {
        if (itemID) {
            axios.get<ItemCardData>(`http://localhost:3000/api/items/${itemID}`)
                .then(response => {
                    setItemData(response.data);
                    setAvailableDays(response.data.available_days.map((day: string) => new Date(day)) as [Date, Date]);
                    if (response.data.user_id) {
                        return axios.get<ProfileFormData>(`http://localhost:3000/api/user/profile/${response.data.user_id}`);
                    } else {
                        console.warn("User ID not found in item data.");
                        return Promise.reject('User ID not found');
                    }
                })
                .then(profileResponse => {
                    setProfileData(profileResponse.data);
                })
                .catch(error => console.error("Error fetching data:", error));
        }
    }, [itemID]);

    const handleReserve = async () => {
        const userId = localStorage.getItem('userId');
        if (!itemID || !startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }

        const reservationData = {
            item_id: itemID,
            user_id: userId,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
        };

        console.log("Reservation data being sent:", reservationData);

        try {
            await axios.post('http://localhost:3000/api/reservations', reservationData);
            setSuccess("Reservation request sent successfully!");
            setError(null);
        } catch (error) {
            console.error("Error reserving item:", error);
            setError("Failed to send reservation request. Please try again.");
            setSuccess(null);
        }
    };

    const handleEdit = () => {
        navigate(`/edit-item/${itemID}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/items/${itemID}`);
            setSuccess("Item deleted successfully!");
            navigate('/home');
        } catch (error) {
            console.error("Error deleting item:", error);
            setError("Failed to delete item. Please try again.");
        }
    };

    const isDateAvailable = (date: Date) => {
        if (!availableDays) return false;
        const [availableStart, availableEnd] = availableDays;
        return date >= availableStart && date <= availableEnd;
    };

    const getDateClassName = (date: Date) => {
        return isDateAvailable(date) ? 'available-date' : 'unavailable-date';
    };

    if (!itemData) return <p>Loading...</p>;

    return (
        <div>
            <Header />
            <div className='display'>
                <div className='card'>
                    {itemData.image_url && <img className="item-img" src={itemData.image_url} alt={itemData.name} />}
                    <div className="info">
                        <h3>{itemData.name}</h3>
                        <p>{itemData.description}</p>
                        <p>{itemData.category}</p>
                        {isOwner && (
                            <div className="owner-controls">
                                <button className="edit-button" onClick={handleEdit}>Edit Item</button>
                                <button className="delete-button" onClick={handleDelete}>Delete Item</button>
                            </div>
                        )}
                    </div>
                    {profileData && (
                        <div className="profile-info-card">
                            {profileData.profile_image_url && (
                                <img src={profileData.profile_image_url} alt="Profile" />
                            )}
                            <ul>
                                <li>Posted by: {profileData.full_name}</li>
                                <li>Phone: {profileData.phone_number}</li>
                                <li>Address: {profileData.address}</li>
                            </ul>
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
                            filterDate={isDateAvailable}
                            dayClassName={getDateClassName}
                        />
                        <br />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date || undefined)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            placeholderText="End Date"
                            filterDate={isDateAvailable}
                            dayClassName={getDateClassName}
                        />
                        <br />
                        <button onClick={handleReserve}>Reserve</button>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ItemCard;