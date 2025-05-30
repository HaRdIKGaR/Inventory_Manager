import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusIcon } from '@heroicons/react/24/solid'

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [barcode, setBarcode] = useState('');
 
  const [quantity, setQuantity] = useState('');
  const [productNameFilter, setproductNameFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState('');
const [dateStart, setDateStart] = useState('');
const [dateEnd, setDateEnd] = useState('');

  // Fetch inventory on load
 useEffect(() => {
  const fetchInventory = async () => {
    const token = localStorage.getItem('token'); // adjust based on how you store it

    try {
      const response = await fetch('/api/inventory', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // <-- Important!
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setInventory(data);
    } catch (err) {
      console.error(err.message);
      // Optionally redirect to login page or show message
    }
  };

  fetchInventory();
}, []);

const token = localStorage.getItem("token");

  const handleAddStock = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ barcode, quantity })
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Stock added successfully ✅");

      setInventory(prev => {
        const updated = prev.map(item =>
          item.barcode === data.inventory.barcode ? data.inventory : item
        );
        const exists = prev.some(item => item.barcode === data.inventory.barcode);
        return exists ? updated : [...prev, data.inventory];
      });

      setBarcode('');
      setQuantity('');
    } else {
      toast.error(data.message || "Failed to add stock ❌");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to add stock ❌");
  }
};


  const filteredInventory = inventory.filter(item => {
  const matchesBarcode = item.barcode.includes(barcode);
  const matchesName = item.productName.toLowerCase().includes(productNameFilter.toLowerCase());
  const matchesCategory = categoryFilter === '' || (item.category && item.category.toLowerCase().includes(categoryFilter.toLowerCase()));
  

  const itemDate = new Date(item.updatedAt);
  const matchesDate =
    (!dateStart || itemDate >= new Date(dateStart)) &&
    (!dateEnd || itemDate <= new Date(dateEnd + 'T23:59:59'));

  return matchesBarcode && matchesName && matchesCategory  && matchesDate;
});
const Mode = localStorage.getItem("theme")

  return (
    <>
    <div className={`min-h-screen ${
        Mode === 'dark' ? 'bg-gradient-to-r from-slate-950 via-gray-900 to bg-slate-950 text-white' : 'bg-white text-black'
      }`}>

    <ToastContainer position="top-right" autoClose={3000} />

    <div className="max-w-5xl mx-auto p-6 ">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4">Inventory</h2>

      <input
        type="text"
        placeholder="Search by Barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        className="w-1/2 p-2 border-[1px] rounded-lg mb-4"
        />

      <form onSubmit={handleAddStock} className="flex gap-2 mb-4 w-full sm:w-1/2 ">
        
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={`border transition-all duration-200 p-2 rounded-lg flex-1   `}
          required
          />
          
        <button className={` ${Mode==="dark" ?"text-white border-[1px] hover:bg-white hover:text-black":"text-black border-[2px] hover:bg-black hover:text-white"} mix-blend-difference transition-all duration-200   rounded-xl px-4 py-2   flex flex-row gap-1 items-center`}>
          <PlusIcon className="h-5 w-5" />
          Add Stock
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
  <input
    type="text"
    placeholder="Filter by Product Name"
    value={productNameFilter}
    onChange={(e) => setproductNameFilter(e.target.value)}
    className="border p-2 rounded-lg"
    />
  <input
    type="text"
    placeholder="Filter by Category"
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    className="border p-2 rounded-lg"
    />
  <input
    type="date"
    value={dateStart}
    onChange={(e) => setDateStart(e.target.value)}
    className={`border p-2 rounded-lg transition-all duration-200  ${Mode==="dark" ? " hover:bg-white hover:text-black " : "hover:text-white hover:bg-gray-800"} `}
    />
  <input
    type="date"
    value={dateEnd}
    onChange={(e) => setDateEnd(e.target.value)}
     className={`border p-2 rounded-lg transition-all duration-200  ${Mode==="dark" ? " hover:bg-white hover:text-black " : "hover:text-white hover:bg-gray-800"} `}
    />
  
</div>


      <div className="overflow-x-auto">
  <table className="w-full table-auto border-collapse mt-2 sm:mt-6">
    <thead>
      <tr>
        <th className="border px-1 sm:px-4 py-2 hidden sm:table-cell text-sm sm:text-base  bg-gray-600">Barcode</th>
        <th className="border px-1 sm:px-4 py-2 text-sm sm:text-base bg-gray-600">Product</th>
        <th className="border px-1 sm:px-4 py-2 text-sm sm:text-base bg-gray-600">Quantity</th>
        <th className="border px-1 sm:px-4 py-2 text-sm sm:text-base bg-gray-600">Last Updated</th>
      </tr>
    </thead>
    <tbody>
      {filteredInventory.map(item => (
        <tr key={item._id}>
          <td className="border px-4 py-2 text-sm sm:text-base hidden sm:table-cell">{item.barcode}</td>
          <td className="border px-4 py-2 text-sm sm:text-base">{item.productName}</td>
          <td className="border px-4 py-2 text-sm sm:text-base">{item.quantity}</td>
          <td className="border px-2  py-2 text-sm sm:text-base ">{new Date(item.updatedAt).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
      </div>
          </>
  );
};

export default InventoryPage;
