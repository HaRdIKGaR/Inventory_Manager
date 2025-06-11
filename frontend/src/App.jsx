import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/login'; // Make sure casing matches filename
import Admin from './pages/Admin';
import SalesEntry from './pages/SalesEntry';
import AddProduct from './pages/AddProduct';
import Inventory from './pages/Inventory';
import Charts from './pages/Charts';
import './App.css';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element = {<Admin/>} />
        <Route path = "/SalesEntry" element = {<SalesEntry/>}/>
        <Route path = "/AddProduct" element = {<AddProduct/>}/>
        <Route path = "/Inventory" element = {<Inventory/>}/>
        <Route path = "/Charts" element = {<Charts/>}/>
      </Routes>
    
  );
}

export default App;
