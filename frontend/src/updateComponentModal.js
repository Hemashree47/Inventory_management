import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getRegisterComponents } from './projectApi'; // Adjust the path to your API function

const UpdateComponentModal = ({ isOpen, onClose, onSubmit, component }) => {
    const [newComponentName, setNewComponentName] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [registerComponents, setRegisterComponents] = useState([]);
    const [filteredComponents, setFilteredComponents] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch components when the modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchComponents = async () => {
                try {
                    const components = await getRegisterComponents();
                    setRegisterComponents(components);
                    setFilteredComponents(components); // Initial unfiltered list
                } catch (error) {
                    console.error('Error fetching components:', error);
                }
            };
            fetchComponents();
        }
    }, [isOpen]);

    // Filter components when the user types in the input
    useEffect(() => {
        if (newComponentName) {
            const filtered = registerComponents.filter((component) =>
                component.componentName.toLowerCase().includes(newComponentName.toLowerCase())
            );
            setFilteredComponents(filtered);
        } else {
            setFilteredComponents(registerComponents); // Reset to all components if input is empty
        }
    }, [newComponentName, registerComponents]);

    // Set initial values when the component prop is provided
    useEffect(() => {
        if (component) {
            setNewComponentName(component.componentName);
            setNewQuantity(component.quantity);
        }
    }, [component]);

    // Handle the component selection from the dropdown
    const handleComponentSelect = (name) => {
        setNewComponentName(name); // Set the selected component name
        setIsDropdownOpen(false);  // Close the dropdown immediately after selecting
    };

    const handleSubmit = () => {
        if (!newComponentName && !newQuantity) {
            toast.warning('Please provide a new component name or quantity', { autoClose: 2000 });
            return;
        }

        onSubmit(component.componentName, { newName: newComponentName, newQuantity: newQuantity });
        onClose(); // Close the modal after submitting
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Update Component</h2>
                <label className="block mb-4 relative">
                    Component Name:
                    <input
                        type="text"
                        value={newComponentName}
                        onChange={(e) => setNewComponentName(e.target.value)}
                        className="border rounded p-2 mt-1 w-full"
                        onFocus={() => setIsDropdownOpen(true)} // Show dropdown when focused
                    />
                    {/* Dropdown for filtered components */}
                    {isDropdownOpen && filteredComponents.length > 0 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1 w-full">
                            {filteredComponents.map((component) => (
                                <div
                                    key={component._id}
                                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => handleComponentSelect(component.componentName)} // Close dropdown on selection
                                >
                                    {component.componentName}
                                </div>
                            ))}
                        </div>
                    )}
                </label>
                <label className="block mb-4">
                    Quantity:
                    <input
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        className="border rounded p-2 mt-1 w-full"
                        min="0"
                    />
                </label>
                <div className="flex space-x-2">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Update
                    </button>
                    <button
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateComponentModal;
