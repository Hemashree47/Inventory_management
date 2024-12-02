import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddComponentModal from './AddComponentModal';
import PasswordModal from './PasswordModal';
import ConfirmComponentModal from './ConfirmComponentModal';
import UpdateComponentModal from './updateComponentModal';
import { getProjectComponents, addComponent, updateComponentQuantity, deleteComponents, updateComponentName } from './projectApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const FIXED_PASSWORD = "0000"


const ProjectComponentsPage = () => {
    const { projectName } = useParams();
    const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
    const [components, setComponents] = useState({});
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
        // Check if filteredComponents and componentName are valid
        if (!componentName || !filteredComponents) {
            toast.error('Invalid component name or missing components list', { autoClose: 2000 });
            return;
        }
    
        // Check if the component already exists (ensuring componentName is valid)
        const componentExists = filteredComponents.some(
            (component) => component?.componentName?.toLowerCase() === componentName.toLowerCase()
        );
    
        if (componentExists) {
            toast.warning('Component already exists', { autoClose: 2000 });
            return;
        }
    
        try {
            await addComponent(projectName, { componentName, quantity });
            toast.success('Component added successfully', {
                autoClose: 2000,
            });
            await fetchComponents(); // Refresh the component list
            handleCloseComponentModal();
        } catch (error) {
            console.error('Error adding component:', error);
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
            if (!oldComponentName) {
                toast.error("Component name is missing", { autoClose: 2000 });
                return; // Exit if oldComponentName is undefined
            }
    
            if (!isAuthenticated) {
                // Set the action to be performed after password verification
                askForPassword(async () => {
                    console.log('Updating component:', oldComponentName, updates); // Log values
        
                    const updatePromises = [];
        
                    // Fetch existing components
                    const response = await getProjectComponents(projectName);
                    const componentsArray = response.components || []; // Ensure it's an array
        
                    // Check if newName is provided and not the same as the old name
                    if (updates.newName && updates.newName !== oldComponentName) {
                        const nameExists = componentsArray.some(component => component.name === updates.newName);
        
                        if (nameExists) {
                            toast.warning('Component name already exists', { autoClose: 2000 });
                            return; // Stop execution if the name exists
                        }
        
                        updatePromises.push(updateComponentName(projectName, oldComponentName, updates.newName));
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
                const componentsArray = response.components || []; // Ensure it's an array
        
                console.log('Existing Components:', componentsArray);
        
                // Check if newName is provided and not the same as the old name
                if (updates.newName && updates.newName !== oldComponentName) {
                    const nameExists = componentsArray.some(component => component.name === updates.newName);
        
                    if (nameExists) {
                        toast.warning('Component name already exists', { autoClose: 2000 });
                        return; // Stop execution if the name exists
                    }
        
                    updatePromises.push(updateComponentName(projectName, oldComponentName, updates.newName));
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
            toast.error(error.message || 'Error updating component', { autoClose: 2000 });
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

    useEffect(() => {
        fetchComponents();
    }, [projectName]);

    const filteredComponents = Object.values(components).filter((component) =>
        component.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      


    return (
        <div className="w-full h-screen flex flex-col  bg-gradient-to-r from-amber-800 to-red-950">
            <div className="flex justify-between items-center p-4">
                <h2 className="text-white text-2xl font-bold">Components for {projectName}</h2>
                <div className='relative'>
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className=" p-2 pl-10 rounded-xl w-full bg-gray-400 bg-opacity-20 hover:border-gray-300"
                    />
                    <i className="fas fa-search absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
                </div>
            </div>
            <button
                className="ml-4 text-xl bg-yellow-600 text-black text-bold py-2 px-2 rounded hover:bg-white transition duration-300 mb-4 self-start font-bold"
                onClick={handleOpenComponentModal}
            >
                Add Component
            </button>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex-grow overflow-hidden  p-4 rounded-lg shadow-md">
                <ul className="p-4 h-full overflow-y-auto">
                    {filteredComponents.length > 0 ? (
                        filteredComponents.map((component) => (
                            <div key={component._id} className="last:border-none border-b border-gray-400 py-2 flex justify-between items-center text-white">
                                <span className="text-xl">{component.name}</span>
                                {/* <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleQuantityUpdate(componentName, parseInt(e.target.value))}
                                    className="border rounded w-16 p-1 text-center"
                                    min="0"
                                /> */}
                                
                                {/* <button
                                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                                        onClick={() => handleDeleteComponent(componentName)}
                                    >
                                        Delete
                                    </button> */}


                                    <div className="text-xl flex justify-between items-center py-2 space-x-4">
                                        <span className="font-medium bg-opacity-40 text-yellow-100 bg-yellow-600 border-gray-300 w-24 h-8 flex items-center justify-center rounded-md">
                                            {component.quantity}
                                        </span>

                                        <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => handleOpenUpdateModal({ componentName: component.name, quantity: component.quantity})}
                                    >
                                        <i className="fas fa-pencil-alt"></i>
                                    </button>

                                        <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleOpenConfirmModal(component._id)}
                                        >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                    </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white text-xl">No components available</p>
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

export default ProjectComponentsPage;