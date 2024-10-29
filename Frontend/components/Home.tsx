// Home
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Item } from '../src/types/types';
import Header from './navigation/Header';
import Footer from './navigation/Footer';

const Home: React.FC = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/api/items')
            .then(response => {
                const itemsData = response.data;

                if (Array.isArray(itemsData)) {
                    setItems(itemsData);
                    setFilteredItems(itemsData);

                    const uniqueCategories = Array.from(
                        new Set(itemsData
                            .filter((item: Item) => item.category)
                            .map((item: Item) => item.category)
                        )
                    );

                    setCategories(uniqueCategories);
                } else {
                    console.error("The received data is not an array:", itemsData);
                }
            })
            .catch(error => console.error("Error while retrieving data:", error));
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filterItems = () => {
        let updatedItems = items;

        if (searchQuery.trim()) {
            updatedItems = updatedItems.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory) {
            updatedItems = updatedItems.filter(item => item.category === selectedCategory);
        }

        setFilteredItems(updatedItems);
    };

    useEffect(() => {
        filterItems();
    }, [searchQuery, selectedCategory, items]);

    const handleCategoryClick = (category: string | null) => {
        setSelectedCategory(category);
    };

    const handleItemClick = (itemId: number) => {
        localStorage.setItem('itemID', itemId.toString());
        navigate(`/item/${itemId}`);
    };

    return (
        <div className="home">
            {/* Header */}
            <Header />

            {/* Search */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Categories */}
            <div className="categories">
                <button onClick={() => handleCategoryClick(null)} className="category-button">All</button>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className="category-button"
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Items Cards */}
            <div className="product-grid">
                {filteredItems.map(item => (
                    <div
                        key={item.id}
                        className="product-card"
                        onClick={() => handleItemClick(item.id)}
                    >
                        <img
                            src={item.image_url}
                            alt={item.name}
                            style={{ width: '80px', height: '80px' }}
                        />
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
