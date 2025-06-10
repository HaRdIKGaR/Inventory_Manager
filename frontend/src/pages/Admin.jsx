/***** components/Admin.tsx *****/
import React, { useState, useEffect } from 'react';
import { IoPeopleOutline } from "react-icons/io5";
import { FcSalesPerformance } from "react-icons/fc";
import { MdOutlineInventory } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ParticlesBackground from "./ParticlesBackground.jsx"; // adjust path if needed



const Admin = () => {
  

const [Mode, setMode] = useState("light");
useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setMode(storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = Mode === "light" ? "dark" : "light";
    console.log({newTheme})
    setMode(newTheme);
    localStorage.setItem("theme", newTheme);
  };


  const Tab = ({ value}) => {
    
    return (
      <div
      
       
        className="relative z-10 cursor-pointer p-1.5 text-sm sm:text-md rounded-lg hover:scale-105 transition-all duration-250 font-semibold text-white mix-blend-difference hover:bg-white hover:text-black "
      >
        {value}
      </div>
    );
  };

 


  return (
    <>
      <ParticlesBackground />
    <div className={`min-h-screen w-full transition-colors duration-300 ${
        Mode === 'dark' ? 'bg-gradient-to-r from-slate-950 via-gray-900 to bg-slate-950 text-white' : 'bg-white text-black'
      }`}  >

      <div
        className="shadow-md shadow-gray-800 backdrop-blur-sm bg-gradient-to-r from-slate-800 to-slate-900 text-white  p-1 sm:p-4 gap-3 flex flex-col sm:flex-row items-center sm:justify-between"
        
      >
        <div className="text-xl font-bold tracking-wide">Inventory Management</div>
        <div  className="relative flex gap-4">
          <Link to="/AddProduct">
            <Tab value="Add Item" />
          </Link>
          <Tab value="Action 2" />
          <Tab value="Action 3" />
          <Tab value="Action 4" />
          <button onClick={toggleTheme} className={`rounded-xl py-1 px-2 cursor-poi ${
  Mode === "light" ? "bg-white text-black border border-black" : "bg-black text-white border border-gray-400"
}`}>{Mode==="light" ? "Dark":"Light"} </button>
          
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 w-[80vw] mx-auto mt-[10vh] sm:mt-[15vh] gap-4">

        <Link to = "/Charts">
        <motion.div
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-[30vh] hover:h-[40vh] transition-all duration-180 bg-gradient-to-r from-cyan-700 via-teal-500 to-cyan-600 rounded-xl flex flex-col gap-3 text-white pt-2 items-center shadow-md shadow-blue-900"
        >
          <IoPeopleOutline className="w-2/5 h-2/6" />
          <div className="text-lg sm:text-2xl font-bold">Top Products</div>
        </motion.div>
          </Link>

        <Link to="/SalesEntry">
          <motion.div
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`h-[30vh] hover:h-[40vh] transition-all duration-180 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-700 rounded-xl flex flex-col gap-3 text-white pt-2 items-center shadow-md ${Mode==="dark" ? "shadow-slate-500":'shadow-black'} `}
            >
            <FcSalesPerformance className="w-2/5 h-2/6" />
            <div className="text-lg sm:text-2xl font-bold">Sales</div>
          </motion.div>
        </Link>

        <Link to="/Inventory">
          <motion.div
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`h-[30vh] hover:h-[40vh] transition-all duration-180 bg-gradient-to-r from-blue-400 via-blue-400 to-blue-700 rounded-xl flex flex-col gap-3 text-white pt-2 items-center shadow-md ${Mode==='dark' ?"shadow-slate-500":"shadow-black"} `}
            >
            <MdOutlineInventory className="w-2/5 h-2/6" />
            <div className="text-lg sm:text-2xl font-bold">Inventory</div>
          </motion.div>
        </Link>

        <motion.div
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="h-[30vh] hover:h-[40vh] transition-all duration-180 bg-gradient-to-r from-zinc-400 via-stone-600 to-zinc-700 rounded-xl flex flex-col gap-3 text-white pt-2 items-center shadow-md shadow-cyan-950"
          >
          <IoMdNotificationsOutline className="w-2/5 h-2/6" />
          <div className="text-lg sm:text-2xl font-bold">Alerts</div>
        </motion.div>
      </div>
          </div>
    </>
  );
};

export default Admin;
