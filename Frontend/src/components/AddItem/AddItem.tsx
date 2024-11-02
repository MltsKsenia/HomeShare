import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import Header from '../navigation/Header/Header';
import Footer from '../navigation/Footer/Footer';
import './AddItem.css';

const AddItem: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image_url, setImageUrl] = useState('');
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const navigate = useNavigate();
    const imgbbApiKey = 'fd0f867a385e53a5721a13e32b2985fd';

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
            const imageUrl = response.data.data.url;
            setImageUrl(imageUrl);
            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const user_id = localStorage.getItem('userId');

        if (!user_id) {
            alert("User ID is missing.");
            return;
        }

        const availableDays = [
            startDate ? startDate.toISOString() : null,
            endDate ? endDate.toISOString() : null
        ].filter(Boolean);

        try {
            console.log('Submitting Item:', {
                user_id,
                name,
                description,
                category,
                image_url,
                available_days: availableDays
            });

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/items`, {
                user_id,
                name,
                description,
                category,
                image_url,
                available_days: availableDays
            });

            alert("Item created successfully!");
            navigate('/home');
        } catch (error) {
            console.error("Error creating item:", error);
            alert("Failed to create item. Please try again.");
        }
    };

    return (
        <div>
            <Header />
            <div className="add-item">
                <form onSubmit={handleSubmit}>
                    <h2>Add New Item</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <br />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <br />
                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <div>
                        <br />
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
                        </div>
                        <br />
                    </div>
                    {image_url && (
                        <div>
                            <img src={image_url} alt="Uploaded" style={{ width: '100px', height: '100px' }} />
                        </div>
                    )}
                    <div className='date-picker-container'>
                        <label>Available Days:</label>
                        <br />
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => date && setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Start Date"
                        />
                        <br />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => date && setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            placeholderText="End Date"
                        />
                    </div>
                    <button className='add-item-button' type="submit">Add Item</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default AddItem;