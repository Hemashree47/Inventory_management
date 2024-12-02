import React, { useEffect, useState } from "react";
import ComponentList from "./ComponentList"; // Adjust the path based on your project structure
import axios from "axios";

const Dashboard = () => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    // Fetch components from the API
    const fetchComponents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/components"); // Replace with your actual API URL
        setComponents(response.data.components); // Assuming the API returns { components: [...] }
      } catch (error) {
        console.error("Error fetching components:", error);
      }
    };

    fetchComponents();
  }, []); // Empty dependency array ensures the API call runs only once

  return (
    <div>
      <h1>Dashboard</h1>
      <ComponentList components={components} />
    </div>
  );
};

export default Dashboard;
