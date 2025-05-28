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
     const response = await fetch("/api/products", {

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

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-xl border rounded-xl mt-4">
      <h1 className="text-2xl font-bold mb-4">Register New Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          ref={barcodeInputRef}
          type="text"
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
          required
        />
        
        <textarea
          placeholder="Remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Register Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
