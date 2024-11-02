// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import Catalog from './components/Catalog/Catalog';
import LogIn from './components/LogIn/LogIn';
import AddItem from './components/AddItem/AddItem';
import MyProfile from './components/MyProfile/MyProfile';
import ItemCard from './components/ItemCard/ItemCard';
import MainPage from './components/MainPage/MainPage'
import EditItem from './components/EditItem/EditItem';
import MyOrders from './components/MyOrders/MyOrders';
import MyItems from './components/MyItems/MyItems';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/add-item" element={<AddItem />} />
      <Route path="/item/:itemID" element={<ItemCard />} />
      <Route path="/edit-item/:id" element={<EditItem />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/my-items" element={<MyItems />} />
    </Routes>
  );
};

export default App;
