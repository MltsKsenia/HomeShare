// servises/app.ts
import axios from 'axios';

const API_URL = '/api';
export const fetchItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/items`);
        return response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
};
export const addItem = async (itemData: FormData) => {
    try {
        const response = await axios.post(`${API_URL}/items`, itemData);
        return response.data;
    } catch (error) {
        console.error('Error adding item:', error);
    }
};