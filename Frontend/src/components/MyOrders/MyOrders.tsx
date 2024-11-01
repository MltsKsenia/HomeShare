import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../navigation/Header/Header';
import Footer from '../navigation/Footer/Footer';
import { Order } from '../../types/types';
import './MyOrders.css';

const MyOrders: React.FC = () => {
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [itemOrders, setItemOrders] = useState<Order[]>([]);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const fetchUserOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/reservations/user/${userId}`);
            console.log("User Orders Response:", response.data); // Логирование ответа
            setUserOrders(response.data.reservations);
        } catch (error) {
            console.error("Error fetching user orders:", error);
        }
    };
    const fetchItemOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/reservations/owner/${userId}`);
            setItemOrders(response.data.reservations);
        } catch (error) {
            console.error("Error fetching item orders:", error);
        }
    };

    const fetchAllReservations = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/reservations/user/${userId}`);
            console.log("User reservations:", response.data.reservations);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const handleDeleteOrder = async (reservationId: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/reservations/${reservationId}`);
            setUserOrders(userOrders.filter(order => order.id !== reservationId));
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const handleApprove = async (reservationId: number) => {
        try {
            await axios.patch(`http://localhost:3000/api/reservations/${reservationId}/status`, {
                status: 'approved',
            });
            window.location.reload();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDecline = async (reservationId: number) => {
        try {
            await axios.patch(`http://localhost:3000/api/reservations/${reservationId}/status`, {
                status: 'declined',
            });
            window.location.reload();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleItemClick = (itemId: number) => {
        navigate(`/item/${itemId}`);
    };

    useEffect(() => {
        fetchUserOrders();
        fetchItemOrders();
        fetchAllReservations();
    }, [userId]);

    return (
        <div>
            <Header />
            <div className="my-orders">
                <h2>My Orders</h2>
                <div className='my-orders-info'>
                    <div className="user-orders">
                        <h3>My Reservations</h3>
                        {userOrders.map(order => (
                            <div key={order.id} className="order-item">
                                <h4>{order.item_name}</h4>
                                <img
                                    src={order.item_image_url}
                                    alt={order.item_name}
                                    onClick={() => handleItemClick(order.item_id)}
                                    className="item-thumbnail"
                                />
                                <p>Status: {order.status}</p>
                                <p>Reservation Dates: {order.order_days.join(' to ')}</p>
                                <button className="button-delete" onClick={() => handleDeleteOrder(order.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                    <div className="item-orders">
                        <h3>My Items Reservations</h3>
                        {itemOrders.map(order => (
                            <div key={order.id} className="order-item">
                                <h4>{order.item_name}</h4>
                                <img
                                    src={order.item_image_url}
                                    alt={order.item_name}
                                    onClick={() => handleItemClick(order.item_id)}
                                    className="item-thumbnail"
                                />
                                <p>Status: {order.status}</p>
                                <p>Reservation Dates: {order.order_days.join(' to ')}</p>
                                <button className="button-approve" onClick={() => handleApprove(order.id)}>Approve</button>
                                <button className="button-decline" onClick={() => handleDecline(order.id)}>Decline</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyOrders;
