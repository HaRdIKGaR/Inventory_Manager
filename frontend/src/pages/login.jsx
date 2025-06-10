import React, { useState ,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase';


const phrases = [
  'Manage Your Inventory',
  'Track Your Sales',
  'Get Stock Recommendations',
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3000); // 3 seconds per phrase
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        navigate(`/${decoded.role}`);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
    }
  };

const handleAuth = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const idToken = await user.getIdToken(); // Get Firebase ID token

    const res = await fetch("/api/google-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode(data.token);
      navigate(`/${decoded.role}`);
    } else {
      alert("Authentication failed");
    }
  } catch (err) {
    console.error("Google login error:", err);
    alert("Google login failed");
  }
};



  return (
    <>
 <div className="h-16 flex items-center justify-center ">
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-3xl font-semibold"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </div>

    <div className="min-h-screen flex mt-2  justify-center bg-cover bg-center backdrop-blur-lg " style={{
        backgroundImage: `url('/bg.jpeg')`,}}>
          

      <form onSubmit={handleLogin} className='border-2 bg-white opacity-90   border-black rounded-2xl md:w-[30vw] h-[80vh] sm:h-[70vh] w-[80vw] mx-auto p-4 flex flex-col gap-5   '>
        <h1 className='font-bold text-2xl'>Sign In to your Account</h1>

        <input className='border-[1.5px] border-black rounded-2xl w-9/10 h-3/20 mx-auto px-2' type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className='border-[1.5px] border-black rounded-2xl w-9/10 h-3/20 mx-auto px-2' type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className='mx-auto w-1/3 hover:bg-green-600 transition-colors duration-140  rounded-xl px-2 py-2 border-[1.5px] border-black'>Submit</button>

        <div className=' w-19/20 border-[1px] mx-auto'></div>

        <div className="flex sm:w-1/2 w-9/10 h-7/40 rounded-2xl p-2 border-[1.5px] mx-auto gap-2 items-center hover:bg-slate-700 hover:text-white transition-colors duration-140 md:w-19/20">
          <img src="Google.svg" alt="google" className='h-4/5 w-1/5' />
          <button type='button' onClick={handleAuth}>Continue With Google </button>
        </div>
        <Link to = "/register" className='text-blue-500'>Don't have an account yet? Register</Link>
      </form>
    </div>
    </>
  );
};

export default Login;
