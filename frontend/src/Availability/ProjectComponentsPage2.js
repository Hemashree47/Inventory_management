import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddComponentModal from '../AddComponentModal';
import PasswordModal from '../PasswordModal';
import ConfirmComponentModal from '../ConfirmComponentModal';
import UpdateComponentModal from '../updateComponentModal';
import { getRegisterComponents,getProjectComponents, addComponent, updateComponentQuantity, deleteComponents, updateComponentName } from '../projectApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const FIXED_PASSWORD = "0000"


const ProjectComponentsPage2 = () => {
    const { projectName } = useParams();
    const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
    const [components, setComponents] = useState({});
    const [registerComponents, setRegisterComponents] = useState({}); // State to store register components
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // Track pending actions
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [componentToDelete, setComponentToDelete] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);

    const handleOpenComponentModal = () => setIsComponentModalOpen(true);
    const handleCloseComponentModal = () => setIsComponentModalOpen(false);

    const handleOpenUpdateModal = (component) => {
        setSelectedComponent(component); // Ensure component has the structure {componentName, quantity}
        setIsUpdateModalOpen(true);
    };
    const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);

    const handleOpenConfirmModal = (componentName) => {
        setComponentToDelete(componentName); // Set the component name to delete
        setIsConfirmModalOpen(true);
    };
    
    const handleCloseConfirmModal = () => setIsConfirmModalOpen(false);


    const handleSubmitComponent = async (componentName, quantity) => {
    

    try {
        await addComponent(projectName, { componentName, quantity });
        toast.success('Component added successfully', {
            autoClose: 2000,
        });
        await fetchComponents(); // Refresh the component list
        handleCloseComponentModal();
    } catch (error) {
        console.error('Error adding component:', error);
        // Extract and show more specific error messages if available
        const errorMessage = error.response?.data?.error || 'Error adding component';
        toast.error(errorMessage, { autoClose: 2000 });
    }
};


    const askForPassword = (action) => {
        setPendingAction(() => action); // Set the action to be performed after authentication
        setIsPasswordModalOpen(true); // Open the password modal
    };

    const handlePasswordSubmit = (enteredPassword) => {
        if (enteredPassword === FIXED_PASSWORD) {
            setIsAuthenticated(true);
            setIsPasswordModalOpen(false);
            if (pendingAction) {
                pendingAction(); // Perform the pending action after successful authentication
                setPendingAction(null); // Clear the pending action
            }
        } else {
            toast.error('Incorrect password', { autoClose: 2000 });
            setIsPasswordModalOpen(false); // Close the modal on error
        }
    };

    // const handleDeleteComponent = async () => {
    //     try {
    //         await deleteComponents(projectName, componentToDelete);
    //         toast.success('Component deleted successfully', { autoClose: 2000 });
    //         fetchComponents();
    //         handleCloseConfirmModal();
    //     } catch (error) {
    //         toast.error('Error deleting component', { autoClose: 2000 });
    //     }
    // };


    const handleDeleteComponent = async () => {
        try {
            if (!isAuthenticated) {
                
                    askForPassword(async (password) => {
                        try {
                            await deleteComponents(projectName, componentToDelete);
                            toast.success('Component deleted successfully', { autoClose: 2000 });
                            fetchComponents();
                            handleCloseConfirmModal();
                            //resolve(); // Resolve the promise when done
                        } catch (error) {
                            toast.error('Error deleting component', { autoClose: 2000 });
                            //reject(error); // Reject the promise if there's an error
                        }
                    });
                
            } else {
                await deleteComponents(projectName, componentToDelete);
                toast.success('Component deleted successfully', { autoClose: 2000 });
                fetchComponents();
                handleCloseConfirmModal();
            }
        } catch (error) {
            toast.error('Error deleting component', { autoClose: 2000 });
        }
    };
    
    
    // const handleUpdateComponent = async (oldComponentName, updates) => {
    //     try {
    //         console.log('Updating component:', oldComponentName, updates); // Log values
    
    //         const updatePromises = [];
    
    //         const existingComponents = await getProjectComponents(projectName);
    //         const componentsArray = Array.isArray(existingComponents) ? existingComponents : [];
    
    //         // Check if newName is provided and not the same as the old name
    //         if (updates.newName && updates.newName !== oldComponentName) {
    //             const nameExists = componentsArray.some(component => component.componentName === updates.newName);
    
    //             if (nameExists) {
    //                 throw new Error('New component name already exists');
    //             }
    
    //             updatePromises.push(updateComponentName(projectName,oldComponentName, updates.newName));
    //         }
    
    //         if (updates.newQuantity !== undefined) {
    //             updatePromises.push(updateComponentQuantity(projectName, oldComponentName, updates.newQuantity));
    //         }
    
    //         await Promise.all(updatePromises);
    
    //         toast.success('Component updated successfully', { autoClose: 2000 });
    //         fetchComponents(); // Refresh the list after successful update
    //         handleCloseUpdateModal();
    //     } catch (error) {
    //         console.error('Error updating component:', error);
    //         if (error.message === 'New component name already exists') {
    //             toast.warning('Component name already exists', { autoClose: 2000 });
    //         } else {
    //             toast.error('Error updating component', { autoClose: 2000 });
    //         }
    //     }
    // };
    

    const handleUpdateComponent = async (oldComponentName, updates) => {
        try {
            if (!isAuthenticated) {
                // Set the action to be performed after password verification
                askForPassword(async () => {
                    console.log('Updating component:', oldComponentName, updates); // Log values
    
                    const updatePromises = [];
    
                    // Fetch existing components
                    const response = await getProjectComponents(projectName);
                    const componentsObject = response.components || {}; // Ensure it's an object
                    const existingComponents = Object.values(componentsObject); // Convert to array
    
                    // console.log('Existing Components:', existingComponents);
    
                    // Check if newName is provided and not the same as the old name
                    if (updates.newName && updates.newName !== oldComponentName) {
                        const nameExists = existingComponents.some(component => component.ComponentName === updates.newName);
    
                        if (nameExists) {
                            //throw new Error('New component name already exists');
                            toast.warning('Component name aldready exixts', { autoClose: 2000 })
                        }
    
                        updatePromises.push(updateComponentName(projectName,oldComponentName, updates.newName));
                    }
    
                    if (updates.newQuantity !== undefined) {
                        updatePromises.push(updateComponentQuantity(projectName, oldComponentName, updates.newQuantity));
                    }
    
                    await Promise.all(updatePromises);
    
                    toast.success('Component updated successfully', { autoClose: 2000 });
                    fetchComponents(); // Refresh the list after successful update
                    handleCloseUpdateModal();
                });
            } else {
                console.log('Updating component:', oldComponentName, updates); // Log values
    
                const updatePromises = [];
    
                // Fetch existing components
                const response = await getProjectComponents(projectName);
                const componentsObject = response.components || {}; // Ensure it's an object
                const existingComponents = Object.values(componentsObject); // Convert to array
    
                console.log('Existing Components:', existingComponents);
    
                // Check if newName is provided and not the same as the old name
                if (updates.newName && updates.newName !== oldComponentName) {
                    const nameExists = existingComponents.some(component => component.componentName === updates.newName);
    
                    if (nameExists) {
                        //throw new Error('New component name already exists');
                        toast.warning('Component name aldready exixts', { autoClose: 2000 })
                    }
    
                    updatePromises.push(updateComponentName(projectName,oldComponentName, updates.newName));
                }
    
                if (updates.newQuantity !== undefined) {
                    updatePromises.push(updateComponentQuantity(projectName, oldComponentName, updates.newQuantity));
                }
    
                await Promise.all(updatePromises);
    
                toast.success('Component updated successfully', { autoClose: 2000 });
                fetchComponents(); // Refresh the list after successful update
                handleCloseUpdateModal();
            }
        } catch (error) {
            console.error('Error updating component:', error);
            console.error(error.message || 'Error updating component', { autoClose: 2000 });
        }
    };
    

    const fetchComponents = async () => {
        try {
            const response = await getProjectComponents(projectName);
            setComponents(response.components || {}); // Ensure components is always an object
            setLoading(false);
        } catch (error) {
            console.error('Error fetching components:', error);
            setError('Failed to fetch components');
            setLoading(false);
        }
    };

    const fetchRegisterComponents = async () => {
        try {
            const response = await getRegisterComponents(); // Fetch register components
            console.log('Fetched register components:', response); // Log the full response
            
            if (Array.isArray(response) && response.length > 0) {
                // Transform the array into an object with component names as keys
                const componentsObject = response.reduce((acc, component) => {
                    acc[component.componentName] = {
                        name: component.componentName,
                        quantity: component.quantity,
                        _id: component._id
                    };
                    return acc;
                }, {});
                setRegisterComponents(componentsObject); // Set register components if available
            } else {
                console.warn('No components found in the response');
                setRegisterComponents({}); // Set to empty object if no components are found
            }
        } catch (error) {
            console.error('Error fetching register components:', error);
        }
    };
    
    
    
    useEffect(() => {
        fetchComponents();
        fetchRegisterComponents(); // Fetch register components on load
    }, [projectName]);

    const filteredComponents = Object.entries(components).filter(([componentName]) =>
        componentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-screen flex flex-col bg-blue-100">
            <div className="flex justify-between items-center p-4">
                <h2 className="text-2xl font-bold">Components for {projectName}</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 pl-10 rounded-xl w-full"
                    />
                    <i className="fas fa-search absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
                </div>
            </div>
            <button
                className="ml-4 bg-blue-500 text-white font-bold py-2 px-2 rounded hover:bg-blue-700 transition duration-300 mb-4 self-start"
                onClick={handleOpenComponentModal}
            >
                Add Component
            </button>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex-grow bg-white shadow-md rounded-lg overflow-hidden">
    <ul className="p-4 h-full overflow-y-auto bg-gradient-to-r from-mint to-pink-100">
        {filteredComponents.length > 0 ? (
            filteredComponents.map(([componentName, { quantity }]) => {
                const registerComponent = registerComponents[componentName] || {}; // Check register components
                const registerQty = registerComponent.quantity || 0;
                
                // Calculate the display quantity
                const displayQuantity =  registerQty - quantity ;

                return (
                    <div key={componentName} className="border-b last:border-none py-2 flex justify-between items-center">
                        <span className="font-medium">{componentName}</span>
                        <div className="flex justify-between items-center py-2 space-x-2">
                            <span className="font-medium border bo border-gray-300 w-40 h-8 flex items-center justify-center rounded-md">
                                Quantity : {quantity}
                            </span>
                            <div className="flex items-center space-x-2">
                                        <span className="font-medium">Register Qty:</span>
                                        <span 
                                            className={`font-medium border border-b-2 w-24 h-8 flex items-center justify-center rounded-md ${
                                                displayQuantity < 0 ? '  text-red-700 border-red-500' :
                                                displayQuantity === 0 ? 'text-gray-700 border-gray-500' :
                                                'text-black border-gray-500'
                                            }`}
                                        >
                                            {displayQuantity === 0 ? registerQty : (displayQuantity < 0 ? `- ${Math.abs(displayQuantity)}` : displayQuantity)}
                                        </span>
                                    </div>
                        </div>
                    </div>
                );
            })
        ) : (
            <p className="text-gray-900">No components available</p>
        )}
    </ul>
</div>

            <AddComponentModal
                isOpen={isComponentModalOpen}
                onClose={handleCloseComponentModal}
                onSubmit={handleSubmitComponent}
            />
            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={handlePasswordSubmit}
            />
            <UpdateComponentModal
                isOpen={isUpdateModalOpen}
                onClose={handleCloseUpdateModal}
                onSubmit={handleUpdateComponent}
                component={selectedComponent}
            />
            <ConfirmComponentModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseConfirmModal}
                onConfirm={handleDeleteComponent}
                message={`Are you sure you want to delete the component "${componentToDelete}"?`}
            />
        </div>
    );

  
    
    
};

export default ProjectComponentsPage2;
