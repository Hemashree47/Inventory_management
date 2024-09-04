import React from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHistory, FaClipboardList } from 'react-icons/fa';

const ButtonPage = () => {
    
    const navigate=useNavigate();

    const imageURL='frontend\src\button\background.jpg'

    const handleClick = (buttonName) => {
        alert(`${buttonName} clicked!`);
    };


    const handleLogout = async () => {
      try {
          await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
          toast.success('Logout Successfully!!', { autoClose: 1000 });
          // Clear user-related data from local storage
          localStorage.removeItem('userId');
          localStorage.removeItem('Role');
          
          // Use replace to prevent back navigation
          navigate('/login', { replace: true });
  
          // Optionally, reload the page to ensure state is reset
          window.location.reload();
      } catch (error) {
          console.error('Error during logout:', error);
          toast.error('Failed to log out', { autoClose: 1000 });
      }
  };
  

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center bg-gradient-to-r from-teal-200 via-pink-200 to-yellow-200 " >
      {/* Card container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/Components')}
          className="flex flex-col items-center justify-center w-64 h-64 bg-gray-400 text-white rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition duration-300"
        >
          <FaClipboardList className="text-4xl mb-4" />
          <span>Register Component</span>
        </div>
        <div
          onClick={() => navigate('/ProjectModal')}
          className="flex flex-col items-center justify-center w-64 h-64 bg-gray-400 text-white rounded-lg shadow-lg cursor-pointer hover:bg-green-600 transition duration-300"
        >
          <FaClipboardList className="text-4xl mb-4" />
          <span>Assign project</span>
        </div>
        <div
          onClick={() => navigate('/RequestForm')}
          className="flex flex-col items-center justify-center w-64 h-64 bg-gray-400 text-white rounded-lg shadow-lg cursor-pointer hover:bg-red-600 transition duration-300"
        >
          <FaClipboardList className="text-4xl mb-4" />
          <span>Check Availability</span>
        </div>
      </div>

      {/* Logout button in the top-right corner */}
      <div className="absolute top-4 right-4">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ButtonPage;
