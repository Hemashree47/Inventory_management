import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateQuantityModal = ({ isOpen, onClose, onSubmit, componentName, currentQuantity }) => {
    const [newQuantity, setNewQuantity] = useState(currentQuantity);

    useEffect(() => {
        if (isOpen) {
            setNewQuantity(currentQuantity); // Reset to current quantity when modal is opened
        }
    }, [isOpen, currentQuantity]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newQuantity >= 0) {
            onSubmit(componentName, newQuantity);
        } else {
            toast.warning('Quantity cannot be negative', { autoClose: 2000 });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-2xl font-bold mb-4">Update Quantity</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="new-quantity">
                            New Quantity for {componentName}
                        </label>
                        <input
                            id="new-quantity"
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(parseInt(e.target.value, 10))}
                            placeholder="New Quantity"
                            required
                            className="w-full border-gray-300 rounded-lg p-2"
                            min="0"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-600 py-2 px-4 rounded hover:bg-gray-200 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateQuantityModal;
