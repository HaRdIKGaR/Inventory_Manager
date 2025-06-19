import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF7', '#FF66C4', '#72B5A4'];

const Charts = () => {
  const [data, setData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [category, setCategory] = useState('');
  const [debouncedCategory, setDebouncedCategory] = useState('');
  const [metric, setMetric] = useState('quantity');
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7); // For pie chart
  const [lineDays, setLineDays] = useState(7); // For line chart
  const [linemetric, setLinemetric] = useState("quantity");
  const [paymentData, setPaymentData] = useState([]);


  const token = localStorage.getItem('token');

  // Debounce the category input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCategory(category.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [category]);

  // Fetch pie chart data
  useEffect(() => {
    if (!debouncedCategory) {
      setData([]);
      return;
    }

    const fetchChartData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sales/category/${debouncedCategory}?days=${days}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
        const result = await res.json();
        const formatted = result.map(item => ({
          name: item.product,
          value: metric === 'quantity' ? item.quantity : item.revenue
        }));
        setData(formatted);
      } catch (err) {
        console.error('Error fetching category chart data:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [debouncedCategory, metric, days]);

  // Fetch line chart data
  useEffect(() => {
    const fetchLineData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sales/daily?days=${lineDays}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        setLineData(result);
      } catch (err) {
        console.error("Error fetching daily sales:", err);
      }
    };

    fetchLineData();
  }, [lineDays]);

  useEffect(() => {
  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sales/payment-methods`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setPaymentData(result);
    } catch (err) {
      console.error("Error fetching payment method data:", err);
    }
  };

  fetchPaymentMethods();
}, []);

  const Mode = localStorage.getItem("theme");

  return (
    <div className={`min-h-screen ${Mode === 'dark' ? 'bg-gradient-to-r from-slate-950 via-gray-900 to-slate-950 text-white' : 'bg-white text-black'}`}>
      <div className='flex flex-col sm:flex-row gap-8 py-6 px-4'>

        {/* Pie Chart Section */}
        <div className="w-full sm:w-2/5 px-4   text-center flex flex-col gap-5 items-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 tracking-wider">Category wise Sales</h2>

          <div className="flex flex-wrap gap-4 items-center mb-6 justify-center">
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="Enter category"
              className="border border-gray-300 px-3 py-2 rounded w-[60vw] sm:w-[13vw] hover:border-white"
            />
            <select
              value={metric}
              onChange={e => setMetric(e.target.value)}
              className={`border border-gray-300 px-3 py-2 hover:border-white rounded ${Mode === 'dark' ? 'bg-slate-900 text-white' : ''}`}
            >
              <option value="quantity">By Quantity</option>
              <option value="revenue">By Revenue</option>
            </select>

            {/* Day range selector for pie chart */}
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className={`border border-gray-300 hover:border-white  px-3 py-2 rounded ${Mode === 'dark' ? 'bg-slate-900 text-white' : ''}`}
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading chart...</p>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="70%"
                  fill="#8884d8"
                  label
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available for this category.</p>
          )}

          {/* Payment Method Donut Chart Section */}


        </div>

        {/* Line Chart Section */}
        <div className='w-full sm:w-3/5 px-6 text-center  '>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 tracking-wider">Daily Sales Overview</h2>

          {/* Toggle line metric */}
          <div className="mb-4 flex justify-center gap-4">
            <button
              className={`shadow-md shadow-yellow-800 cursor-pointer px-4 py-2 rounded hover:shadow-lg ${linemetric === "quantity" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
              onClick={() => setLinemetric("quantity")}
            >
              Quantity
            </button>
            <button
              className={`shadow-md shadow-yellow-800 px-4 py-2 rounded cursor-pointer hover:shadow-lg ${linemetric === "revenue" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"} `}
              onClick={() => setLinemetric("revenue")}
            >
              Revenue
            </button>
          </div>

          {/* Day range selector for line chart */}
          <div className="mb-6 flex justify-center">
            <select
              value={lineDays}
              onChange={(e) => setLineDays(parseInt(e.target.value))}
              className={`border border-gray-300 px-3 py-2 rounded hover:border-white ${Mode === 'dark' ? 'bg-slate-900 text-white' : ''}`}
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey={linemetric}
                stroke="#8884d8"
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="w-full sm:w-2/5 px-4 text-center flex items-center">
  <h2 className="text-lg sm:text-xl font-bold  tracking-widest">Payment Method</h2>

  {paymentData.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={paymentData}
          dataKey="revenue"
          nameKey="method"
          innerRadius="40%"  // Donut effect
          outerRadius="70%"
          fill="#8884d8"
          label
        >
          {paymentData.map((_, index) => (
            <Cell key={`cell-p-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <p className="text-gray-500">No payment data available.</p>
  )}
</div>
    </div>
  );
};

export default Charts;
