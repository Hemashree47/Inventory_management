import React, { useState, useEffect } from 'react';
import ComponentList from './ComponentList'; // Adjust the import path as needed

const ParentComponent = () => {
    // Example state for components and register quantities
    const [filteredComponents, setFilteredComponents] = useState([]);
    const [registerComponents, setRegisterComponents] = useState({});

    useEffect(() => {
        // Fetch or set your data here
        // For example purposes, we'll use hardcoded data
        setFilteredComponents([
            ['Component A', { quantity: 10 }],
            ['Component B', { quantity: 5 }]
        ]);
        setRegisterComponents({
            'Component A': { quantity: 8 },
            'Component B': { quantity: 3 }
        });
    }, []);

    return (
        <div className="p-4">
            <ComponentList 
                filteredComponents={filteredComponents}
                registerComponents={registerComponents}
            />
        </div>
    );
};

export default ParentComponent;
