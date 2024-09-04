import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateComponentModal = ({ isOpen, onClose, onSubmit, component }) => {
    const [newComponentName, setNewComponentName] = useState('');
    const [newQuantity, setNewQuantity] = useState('');

    useEffect(() => {
        if (component) {
            setNewComponentName(component.componentName);
            setNewQuantity(component.quantity);
        }
    }, [component]);

    const handleSubmit = () => {
        if (!newComponentName && !newQuantity) {
            toast.warning('Please provide a new component name or quantity', { autoClose: 2000 });
            return;
        }

        onSubmit(component.componentName, { newName: newComponentName, newQuantity: newQuantity });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Update Component</h2>
                <label className="block mb-4">
                    Component Name:
                    <input
                        type="text"
                        value={newComponentName}
                        onChange={(e) => setNewComponentName(e.target.value)}
                        className="border rounded p-2 mt-1 w-full"
                    />
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
