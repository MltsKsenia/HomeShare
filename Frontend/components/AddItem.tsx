import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import Header from './navigation/Header';
import Footer from './navigation/Footer';

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

            await axios.post('http://localhost:3000/api/items', {
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
        <div className="add-item">
            {/* Header */}
            <Header />
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <div>
                    <label>Upload Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                uploadImage(e.target.files[0]);
                            }
                        }}
                    />
                </div>
                {image_url && (
                    <div>
                        <img src={image_url} alt="Uploaded" style={{ width: '100px', height: '100px' }} />
                    </div>
                )}
                <div>
                    <label>Available Days:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => date && setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                    />
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
                <button type="submit">Add Item</button>
            </form>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AddItem;