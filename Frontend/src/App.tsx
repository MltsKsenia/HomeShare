// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '../components/Register';
import Profile from '../components/AddProfile';
import Home from '../components/Home';
import LogIn from '../components/LogIn';
import AddItem from '../components/AddItem';
import MyProfile from '../components/MyProfile';
import ItemCard from '../components/ItemCard';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LogIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/add-profile" element={<Profile />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/add-item" element={<AddItem />} />
      <Route path="/item/:id" element={<ItemCard />} />
    </Routes>
  );
};

export default App;
