import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { RiDeleteBin6Line } from "react-icons/ri";

const SalesEntry = () => {
  const [entries, setEntries] = useState([]);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [barcode, setbarcode] = useState("");
  const [remarks, setRemarks] = useState('');
  const [paymentMethod, setPaymentMethod] = useState("");
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!barcode) return;

      try {
        const res = await fetch(`/api/inventory/barcode/${barcode}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Product not found');

        const data = await res.json();
        
        setProduct(data.productName || "");
        setPrice(data.price || "");
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct('');
        setPrice('');
      }
    };

    const timeout = setTimeout(fetchProductDetails, 400);
    return () => clearTimeout(timeout);
  }, [barcode]);

  const total = Number(quantity || 0) * Number(price || 0);

  const handleAdd = () => {
    if (!product || quantity <= 0 || price < 0) return;
    const date = new Date().toISOString(); // Add current date
    const newEntry = {
      barcode,
      product,
      quantity: Number(quantity),
      price: Number(price),
      total: Number(quantity || 0) * Number(price || 0),

      
      remarks,
    };

    setEntries([...entries, newEntry]);
    setProduct('');
    setQuantity("");
    setPrice("");
    setRemarks('');
    setbarcode("");
  };

  const handleRemove = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
  const grandTotal = entries.reduce((acc, curr) => acc + curr.total, 0);

  try {
    const res = await fetch("/api/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        entries,
        paymentMethod,
        grandTotal,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Sale record failed ❌");
      return;
    }

    toast.success("Sale recorded successfully ✅");
    setEntries([]);
  } catch (err) {
    toast.error("Sale record failed ❌");
  }
};


const Mode = localStorage.getItem("theme");
  return (
<>
<div className={`pt-4  ${
        Mode === 'dark' ? 'bg-gradient-to-r from-slate-950 via-gray-900 to bg-slate-950 text-white' : 'bg-white text-black'
      }`}>
     <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl sm:text-3xl flex justify-center font-bold mb-4 tracking-wide">New Sale Entry</h1>
      <div className='h-[1px] bg-gray-700 w-full'></div>
   <div className={`flex flex-col md:flex-row justify-between max-w-6xl mx-auto p-4  mt-4 rounded min-h-screen ` }>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4  rounded-xl p-4 max-h-[70vh] ">

        <input
          type="text"
          placeholder="barcode"
          value={barcode}
          onChange={(e) => setbarcode(e.target.value)}
          className="border-[1.5px] p-2 rounded-md max-w-[50vw] hover:scale-105 transition-all duration-200 hover:shadow-xl"
          />

        <input
          
          type="text"
          placeholder="Product Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border-[1.5px] p-2 rounded-md max-w-[50vw] hover:scale-105 hover:shadow-xl transition-all duration-200"
          />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="border-[1.5px] p-2 rounded-md max-w-[50vw] hover:scale-105 hover:shadow-xl transition-all duration-200"
          />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="border-[1.5px] p-2 rounded-md max-w-[50vw] hover:scale-105 hover:shadow-xl transition-all duration-200"
          />

        
        

        <textarea
          placeholder="Remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="border-[1.5px] p-2 rounded md:col-span-2 max-w-[50vw] hover:scale-105 transition-all duration-200 hover:shadow-xl"
          />

        <div className="md:col-span-2 ">
          <button
            onClick={handleAdd}
            className={` px-4 py-2 rounded transition-all duration-200 cursor-pointer ${Mode==='dark' ? " bg-gray-200 text-black hover:bg-green-600 hover:text-white ":"bg-black text-white  hover:bg-green-600 hover:text-black"}`}
            >
            Add Sale
          </button>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="mt-6 md:mt-0 md:p-4">
          <h2 className="text-md uppercase text-gray-300 mix-blend-difference font-bold mb-2">Current Sale</h2>
          <table className="w-full table-auto border border-collapse overflow-scroll">
            <thead>
              <tr className="">
                <th className="border px-2 py-1 bg-gray-600 mix-blend-difference">Product</th>
                <th className="border px-2 py-1 bg-gray-600 mix-blend-difference">Qty</th>
                <th className="border px-2 py-1 bg-gray-600 mix-blend-difference">Price</th>
                <th className="border px-2 py-1 bg-gray-600 mix-blend-difference">Total</th> 
                <th className="border px-2 py-1 bg-gray-600 mix-blend-difference">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td className="border px-2 md:px-5 lg:px-8  py-1 sm:py-2 md:py-3">{entry.product}</td>
                  <td className="border px-2 md:px-5 lg:px-8 py-1 sm:py-2 md:py-3">{entry.quantity}</td>
                  <td className="border px-2 md:px-5 lg:px-8 py-1 sm:py-2 md:py-3">₹{entry.price}</td>
                  <td className="border px-2 md:px-5 lg:px-8 py-1 sm:py-2 md:py-3">₹{entry.total.toFixed(2)}</td>
                  <td className="border px-2 md:px-5 lg:px-8 py-1 sm:py-2 md:py-3">
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-red-500 hover:underline cursor-pointer hover:text-red-400"
                      >
                        <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
  <div className="flex flex-col md:flex-row md:items-center gap-4">
    <div className="flex-1">
      <label className="block mb-1 font-semibold">Select Payment Method:</label>
      <select
        className={`border  rounded-md p-2 w-full  ${
        Mode === 'dark' ? 'bg-gradient-to-r from-slate-950 via-gray-900 to bg-slate-950 text-white' : 'bg-white text-black'
      }`}
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        required
      >
        <option value="">Select Payment Method</option>
        <option value="Cash">Cash</option>
        <option value="Credit Card">Credit Card</option>
        <option value="Debit Card">Debit Card</option>
        <option value="UPI">UPI</option>
      </select>
    </div>

    <div className="flex-1 text-right text-lg font-semibold">
      Grand Total: ₹{entries.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}
    </div>
  </div>
</div>

          <div className="text-right mt-4">
            <button
              onClick={handleSubmit}
              className={`  px-4 py-2 rounded transition-all duration-200 cursor-pointer  ${Mode==='dark' ? " bg-gray-200 text-black hover:bg-blue-600 hover:text-white ":"bg-black text-white  hover:bg-blue-500 hover:text-black"}`}
            >
              Submit Sale
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
                  </>
  );
};

export default SalesEntry;
