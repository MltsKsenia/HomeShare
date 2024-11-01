import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Item } from '../../types/types';
import Header from '../navigation/Header/Header';
import Footer from '../navigation/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import './MyItems.css';

const MyItems: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const user_id = localStorage.getItem('userId');
    console.log("User ID:", user_id);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            if (!user_id) {
                console.error("User ID is missing");
                return;
            }
            try {
                const response = await axios.get(`http://localhost:3000/api/items/user/${user_id}`);
                setItems(response.data.items);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [user_id]);

    const handleItemClick = (itemId: number) => {
        navigate(`/item/${itemId}`);
    };

    return (
        <div>
            <Header />
            <div className="my-items">
                <h2>My Items</h2>
                <div className="product-grid">
                    {items && items.length > 0 ? (
                        items.map((item) => (
                            <div key={item.id} className="item-card" onClick={() => handleItemClick(item.id)}> {/* Добавляем обработчик клика */}
                                <img src={item.image_url} alt={item.name} className="item-image" />
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <p>Category: {item.category}</p>
                                    <p className="item-available-days">
                                        Available Days: {item.available_days
                                            ? item.available_days.map((date: string) => date.split('T')[0]).join(' to ')
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-items-message">No items found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyItems;