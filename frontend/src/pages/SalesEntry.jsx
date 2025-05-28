import React, { useState } from 'react';

const SalesEntry = () => {
  const [entries, setEntries] = useState([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [remarks, setRemarks] = useState('');
  const [paymentMethod, setPaymentMethod] = useState("");

  const total = quantity * price;

  const handleAdd = () => {
    if (!product || quantity <= 0 || price < 0) return;
    const newEntry = { product, quantity, price, total, date,paymentMethod, remarks };
    setEntries([...entries, newEntry]);
    setProduct('');
    setQuantity("");
    setPrice("");
    setRemarks('');
    setPaymentMethod("")
    setPrice("")
  };

  const handleRemove = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log("Submitting:", entries);
    // Send to backend
    // fetch("/api/sales", { method: "POST", body: JSON.stringify(entries) })
    setEntries([]);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 border-[1.5px] mt-4 rounded shadow-xl" >
      <h1 className="text-2xl font-bold mb-4">New Sale Entry</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white  rounded-xl p-4">
        <input
          type="text"
          placeholder="Product Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border-[1.5px] p-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
          className="border-[1.5px] p-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(+e.target.value)}
          className="border-[1.5px] p-2 rounded-md"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-[1.5px] p-2 rounded"
        />
        <div className="border-[1.5px] p-2 rounded">{total}</div>

<select
  className="border-[2px] border-gray-400 rounded-md p-2 w-full"
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


        <textarea
          placeholder="Remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="border-[1.5px] p-2 rounded md:col-span-2"
        />
        <div className="md:col-span-2 text-right">
          <button onClick={handleAdd} className="bg-green-500   px-4 py-2 rounded hover:bg-green-400">
            Add Sale
          </button>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Current Sale</h2>
          <table className="w-full table-auto border border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Product</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{entry.product}</td>
                  <td className="border px-2 py-1">{entry.quantity}</td>
                  <td className="border px-2 py-1">₹{entry.price}</td>
                  <td className="border px-2 py-1">₹{entry.total}</td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-4">
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Submit Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesEntry;
