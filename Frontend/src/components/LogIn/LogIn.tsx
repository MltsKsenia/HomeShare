import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../navigation/Header/Header';
import Footer from '../navigation/Footer/Footer';
import './LogIn.css'

const LogIn: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, { username, password });

            if (response.status === 200 && response.data.token) {
                const { token } = response.data;

                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.id;

                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);

                console.log('Saved userId in localStorage:', localStorage.getItem('userId'));

                navigate('/catalog');
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError('An error occurred while trying to log in');
        }
    };

    return (
        <div><Header />
            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <h2>Log In</h2>
                    <div>
                        <label></label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button className="submit-button" type="submit">Log In</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default LogIn;