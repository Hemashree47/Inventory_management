import React, { useState, useEffect } from 'react';

const ComponentList = ({ filteredComponents, registerComponents }) => {
    return (
        <div className="flex-grow bg-white shadow-md rounded-lg overflow-hidden">
            <ul className="p-4 h-full overflow-y-auto bg-gradient-to-r from-mint to-pink-100">
                {filteredComponents.length > 0 ? (
                    filteredComponents.map(([componentName, { quantity }]) => {
                        // Ensure registerComponents is an object and componentName exists
                        const registerComponent = registerComponents[componentName] || {}; // Access register component details
                        return (
                            <div key={componentName} className="border-b last:border-none py-2 flex justify-between items-center">
                                <span className="font-medium">{componentName}</span>
                                <div className="flex justify-between items-center py-2 space-x-2">
                                    <span className="font-medium border border-gray-300 w-24 h-8 flex items-center justify-center rounded-md">
                                        {quantity}
                                    </span>
                                    <span className="font-medium">
                                        Register Qty: {registerComponent.quantity !== undefined ? registerComponent.quantity : 0}
                                    </span> 
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-900">No components available</p>
                )}
            </ul>
        </div>
    );
};

export default ComponentList