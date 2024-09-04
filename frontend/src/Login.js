import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './images/xyma.png';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { username, password } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      navigate('/ButtonPage'); // Redirect to dashboard or another page
    }
  }, [navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      document.cookie = `token=${res.data.token}; path=/;`;
      onLoginSuccess(res.data.token);
      toast.success('Login successful!', { autoClose: 2000 });
      navigate('/ButtonPage');
    } catch (err) {
      console.error('Error logging in:', err.response?.data || err.message);
      if (err.response?.status === 400) {
        toast.error('Username or Password is incorrect!', { autoClose: 2000 });
      } else {
        toast.error('An error occurred. Please try again.', { autoClose: 2000 });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 to-blue-200">
      <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h1 className="text-2xl text-gray-600 font-bold mb-6 text-center">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
