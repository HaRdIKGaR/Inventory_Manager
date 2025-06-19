import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';


const Register = () => {
 const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState(''); // default value
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, company }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful! You can now login.');
        navigate('/login'); // Redirect to login page
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div >
       <form onSubmit={handleRegister} className='border-2 border-black rounded-2xl md:w-[30vw] h-[80vh] w-[80vw] m-auto p-4 flex flex-col gap-5'>
        <h1 className='font-bold text-2xl'>Create an Account</h1>

        <input className='border-[1.5px] border-black rounded-2xl w-9/10 h-3/20 mx-auto px-2' type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />

        <input className='border-[1.5px] border-black rounded-2xl w-9/10 h-3/20 mx-auto px-2' type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className='border-[1.5px] border-black rounded-2xl w-9/10 h-3/20 mx-auto px-2' type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className='border-[1.5px] border-black rounded-2xl w-9/10 h-3/20 mx-auto px-2' type="text" placeholder='Company' value={company} onChange={(e) => setCompany(e.target.value)} />
      <select
  className='border-[1.5px] border-black rounded-2xl w-9/10 h-3/20 mx-auto px-2'
  value={role}
  onChange={(e) => setRole(e.target.value)}
  required
>
  <option value="" disabled>Select Role</option>
  <option value="admin">Admin</option>
  <option value="cashier">Cashier</option>
  <option value="inventory manager">Inventory Manager</option>
</select>

        

        <button className='mx-auto w-1/3 hover:bg-green-600 transition-colors duration-140  rounded-xl px-2 py-2 border-[1.5px] border-black'>Register</button>

        <div className=' w-19/20 border-[1px] mx-auto'></div>

        
      </form>


    </div>
  )
}

export default Register
