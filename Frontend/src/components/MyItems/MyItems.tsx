import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Item } from '../../types/types';
import Header from '../navigation/Header/Header';
import Footer from '../navigation/Footer/Footer';
import './MyItems.css';

const MyItems: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const user_id = localStorage.getItem('userId');
    console.log("User ID:", user_id);

    useEffect(() => {
        const fetchItems = async () => {
            if (!user_id) {
                console.error("User ID is missing");
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3000/api/items/user/${user_id}`);
                console.log("Response data:", response.data);
                setItems(response.data.items);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [user_id]);

    return (
        <div className="my-items">
            <Header />
            <h2>My Items</h2>
            {items && items.length > 0 ? (
                items.map((item) => (
                    <div key={item.id} className="item-card">
                        <img src={item.image_url} alt={item.name} className="item-image" />
                        <div className="item-info">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Category: {item.category}</p>
                            <p>Available Days: {item.available_days ? item.available_days.join(', ') : 'N/A'}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No items found.</p>
            )}
            <Footer />
        </div>
    );
};

export default MyItems;