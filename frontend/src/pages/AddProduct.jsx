import React, { useState, useRef, useEffect } from 'react';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  
  const [remarks, setRemarks] = useState('');
  const barcodeInputRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    barcodeInputRef.current?.focus(); // Autofocus on barcode input
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = { productName, barcode, category, price, remarks };

    try {
     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Product registered successfully');
        setProductName('');
        setBarcode('');
        setCategory('');
        setPrice('');
        setRemarks('');
        barcodeInputRef.current?.focus();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };
const Mode = localStorage.getItem("theme")
  return (
    <div className={`min-h-screen pt-2 ${
        Mode === 'dark' ? 'bg-gradient-to-r from-slate-950 via-gray-900 to bg-slate-950 text-white' : 'bg-white text-black'
      }`}>

    <div className="max-w-2xl mx-auto p-6 shadow-2xl  rounded-xl ">
      <h1 className="text-2xl font-bold mb-4">Register New Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          ref={barcodeInputRef}
          type="text"
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="border p-2 rounded hover:scale-105 transition-all duration-200"
          required
        />
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border p-2 rounded hover:scale-105 transition-all duration-200"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded hover:scale-105 transition-all duration-200"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded hover:scale-105 transition-all duration-200"
          required
        />
        
        <textarea
          placeholder="Remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="border p-2 rounded hover:scale-105 transition-all duration-200"
          />
        <button
          type="submit"
          className={` w-1/3 cursor-pointer px-4 py-2 rounded transition-all duration-200 ${Mode==='dark' ? "bg-white text-black hover:bg-blue-600" : "bg-black text-white hover:bg-blue-600"}`}
          >
          Register Product
        </button>
      </form>
    </div>
          </div>
  );
};

export default AddProduct;
