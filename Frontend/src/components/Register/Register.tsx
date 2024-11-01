// Register.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../navigation/Header/Header';
import Footer from '../navigation/Footer/Footer';
import './Register.css'

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/register', formData);
            if (response.data.userId && response.data.userId.id) {
                localStorage.setItem('userId', response.data.userId.id.toString());
            } else {
                console.error('userId not found in response');
            }

            setSuccessMessage('User registered successfully');
            setError(null);
            navigate('/add-profile');
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div>
            <Header />
            <div className="register-page">
                <form onSubmit={handleSubmit}>
                    <h2>Register</h2>
                    <div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    <button className="submit-button" type="submit">Register</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Register;