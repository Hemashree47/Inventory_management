import React, { useEffect, useState } from "react";
import { getProjectComponents } from "./projectApi"; // Adjust the path as needed

const ComponentList = ({ projectName }) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComponents = async () => {
    try {
      const data = await getProjectComponents(projectName);
      setComponents(data.components); // Assuming the API returns { components: [...] }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching components.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectName) {
      fetchComponents();
    }
  }, [projectName]);

  if (loading) return <p>Loading components...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Components for {projectName}</h2>
      <ul>
        {components.map((component) => (
          <li key={component._id}>
            {component.name} - Quantity: {component.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComponentList;
