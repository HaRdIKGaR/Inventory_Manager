import React, { useState, useEffect } from 'react';
import { FaChartLine } from "react-icons/fa6";
import { FcSalesPerformance } from "react-icons/fc";
import { MdOutlineInventory } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { MdHistory } from "react-icons/md";
const Admin = () => {
  const [salesSummary, setSalesSummary] = useState({ today: 0, month: 0 });
  const [lowStockCount, setLowStockCount] = useState(null);
  const [Mode, setMode] = useState("light");

  const [logs, setLogs] = useState([]);
const [showLogs, setShowLogs] = useState(false);


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/alerts`)
      .then((res) => res.json())
      .then((data) => {
        let count = 0;
        Object.values(data).forEach(items => {
          count += items.length;
        });
        setLowStockCount(count);
      })
      .catch((err) => {
        console.error('Error fetching alerts:', err);
        setLowStockCount(null);
      });
  }, []);



useEffect(() => {
  if (showLogs) {
    fetch(`${import.meta.env.VITE_API_URL}/api/logs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(setLogs)
      .catch(err => console.error("Failed to fetch logs", err));
  }
}, [showLogs]);


  useEffect(() => {
  const token = localStorage.getItem("token");

  fetch(`${import.meta.env.VITE_API_URL}/api/sales/summary`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => setSalesSummary(data))
    .catch(err => console.error("Failed to fetch sales summary", err));
}, []);


  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setMode(storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = Mode === "light" ? "dark" : "light";
    setMode(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/export');
      if (!res.ok) throw new Error("Failed to export");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Export failed: " + err.message);
    }
  };

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const Tab = ({ value }) => (
    <div className="relative z-10 cursor-pointer p-1.5 text-sm sm:text-md rounded-lg hover:scale-105 transition-all duration-250 font-semibold text-white mix-blend-difference hover:bg-white hover:text-black">
      {value}
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col justify-between w-full transition-colors duration-300 ${
      Mode === 'dark'
        ? 'bg-gradient-to-r from-slate-950 via-gray-900 to bg-slate-950 text-white'
        : 'bg-white text-black'
    }`}>

      {/* Top Navigation */}
      <div>
        <div className="relative z-5 anime shadow-md shadow-gray-800 backdrop-blur-sm text-white mix-blend-exclusion p-1 sm:p-4 gap-3 flex flex-col sm:flex-row items-center sm:justify-between">
          <div className="text-xl font-bold tracking-wide">Inventory Management</div>
          <div className="relative flex gap-4">
            <Link to="/AddProduct"><Tab value="Add Item" /></Link>
            <button onClick={handleExport} className="relative z-10 cursor-pointer p-1.5 text-sm sm:text-md rounded-lg hover:scale-105 transition-all duration-250 font-semibold text-white mix-blend-difference hover:bg-white hover:text-black">Export CSV</button>
            <button
        onClick={() => setShowLogs(!showLogs)}
        className={`relative z-10 cursor-pointer p-1.5 text-sm sm:text-md rounded-lg hover:scale-105 transition-all duration-250  text-white mix-blend-difference hover:bg-white hover:text-black ${showLogs ?"font-bold": "font-semibold"}`}
      >
        Logs
      </button>
            
            <button onClick={toggleTheme} className={`cursor-pointer rounded-xl py-1 px-2 border ${Mode === "light" ? "bg-white text-black border-black" : "bg-black text-white border-gray-400"}`}>
              {Mode === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 w-[80vw] mx-auto mt-[10vh] sm:mt-[15vh] gap-4">
          {/* Analyze */}
          <Link to="/Charts">
            <motion.div whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-[30vh] hover:h-[40vh] transition-all duration-180 bg-gradient-to-r from-cyan-700 via-teal-500 to-cyan-600 rounded-xl flex flex-col gap-3 text-white pt-2 items-center shadow-md shadow-blue-900">
              <FaChartLine className="w-2/5 h-2/6" />
              <div className="text-lg sm:text-2xl font-bold">Analyze</div>
            </motion.div>
            <div className="text-center text-sm sm:text-md mt-2 font-semibold text-teal-700 dark:text-teal-300 mix-blend-difference">Total Sales This Month: ₹{salesSummary.month}</div>
          </Link>

          {/* Sales */}
          <Link to="/SalesEntry">
            <motion.div whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={`h-[30vh] hover:h-[40vh] transition-all duration-180 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-700 rounded-xl flex flex-col gap-3 text-white pt-2 items-center shadow-md ${Mode === "dark" ? "shadow-slate-500" : "shadow-black"}`}>
              <FcSalesPerformance className="w-2/5 h-2/6" />
              <div className="text-lg sm:text-2xl font-bold">Sales</div>
            </motion.div>
            <div className="text-center text-sm sm:text-md mt-2 font-semibold text-gray-700 dark:text-gray-300 mix-blend-exclusion">Total Sales Today: ₹{salesSummary.today}</div>
          </Link>

          {/* Inventory */}
          <Link to="/Inventory">
            <motion.div whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`h-[30vh] hover:h-[40vh] transition-all duration-180 bg-gradient-to-r from-blue-400 via-blue-400 to-blue-700 rounded-xl flex flex-col gap-3 text-white pt-2 items-center shadow-md ${Mode === 'dark' ? "shadow-slate-500" : "shadow-black"}`}>
              <MdOutlineInventory className="w-2/5 h-2/6" />
              <div className="text-lg sm:text-2xl font-bold">Inventory</div>
            </motion.div>
          </Link>

          {/* Alerts */}
          <Link to="/Alerts">
            <motion.div whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="h-[30vh] hover:h-[40vh] transition-all duration-180 bg-gradient-to-r from-zinc-400 via-stone-600 to-zinc-700 rounded-xl flex flex-col gap-3 text-white pt-2 items-center shadow-md shadow-cyan-950">
              <IoMdNotificationsOutline className="w-2/5 h-2/6" />
              <div className="text-lg sm:text-2xl font-bold">Alerts</div>
            </motion.div>
            {lowStockCount !== null && (
              <div className="mt-3 text-sm text-teal-500 font-medium text-center">Low Stock Items: {lowStockCount}</div>
            )}
          </Link>
        </div>
      </div>

      {showLogs && (
        <div className="fixed bottom-16 right-5 w-[90vw] sm:w-[30vw] max-h-[50vh] overflow-y-auto bg-white text-black dark:bg-gray-900 dark:text-white shadow-xl rounded-lg p-4 z-40 border border-gray-400">
          <h2 className="text-lg font-semibold mb-2">Recent Activity Logs</h2>
          <ul className="text-sm space-y-2">
            {logs.length === 0 ? (
              <li>No recent logs.</li>
            ) : (
              logs.map((log, index) => (
                <li key={index} className="border-b pb-2">
                  <div className="font-semibold">{log.action}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">{log.details}</div>
                  <div className="text-right text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Sticky Footer */}
      <footer className="w-full py-3 px-4  text-center text-sm sm:text-md text-gray-700 shadow-inner">
        <p>Company: <span className="font-semibold">{decoded.company}</span></p>
      </footer>
    </div>
  );
};

export default Admin;
