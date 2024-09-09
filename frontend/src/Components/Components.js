import React, { useState, useEffect } from 'react';
import AddComponentModal from '../AddComponentModal';
import UpdateComponentModal from '../updateComponentModal'; // Assuming this modal exists similar to UpdateProjectModal
import ConfirmComponentModal from '../ConfirmComponentModal';
import PasswordModal from '../PasswordModal';
import { getRegisterComponents, addRegisterComponent, updateRegisterComponentName, updateRegisterComponentQuantity, deleteRegisterComponent } from '../projectApi'; // Adjust the import path
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FIXED_PASSWORD = '0000';
const Components = () => {
    const [components, setComponents] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [componentToDelete, setComponentToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingAction, setPendingAction] = useState(null); // Track pending actions
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleOpenUpdateModal = (component) => {
        setSelectedComponent(component); // Ensure component has the structure {componentName, quantity}
        setIsUpdateModalOpen(true);
    };
    
    const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);

    const handleOpenConfirmModal = (componentName) => {
        setComponentToDelete(componentName);
        setIsConfirmModalOpen(true);
    };
    const handleCloseConfirmModal = () => setIsConfirmModalOpen(false);

    const handleSubmitComponent = async (componentName, quantity) => {
        // Check if the component already exists
        const componentExists = filteredComponents.some(
            (component) => component.componentName.toLowerCase() === componentName.toLowerCase()
        );
    
        if (componentExists) {
            // Display an error if the component already exists
            toast.warning('Component already exists', { autoClose: 2000 });
            return; // Stop further execution if duplicate is found
        }
    
        try {
            // Proceed with adding the component if it doesn't exist
            await addRegisterComponent(componentName, quantity);
            toast.success('Component added successfully', { autoClose: 2000 });
            fetchComponents(); // Refresh the component list after adding
            handleCloseAddModal();
        } catch (error) {
            toast.error('Error adding component', { autoClose: 2000 });
        }
    };
    

    

    const handleUpdateComponent = async (oldComponentName, updates) => {
        try {
            if(!isAuthenticated){
            // Prepare API calls based on the presence of updates
            askForPassword(async ()=>{
            try{
                const updatePromises = [];
            
            // Check if newName is provided and not the same as the old name
            if (updates.newName && updates.newName !== oldComponentName) {
                // Check if the new name already exists
                const existingComponents = await getRegisterComponents();
                const nameExists = existingComponents.some(component => component.componentName === updates.newName);
            
                if (nameExists) {
                    //throw new Error('New component name already exists');
                    toast.warning('Component name aldready exixts', { autoClose: 2000 })
            }

                // Add the update name promise if the name is unique
                updatePromises.push(updateRegisterComponentName(oldComponentName, updates.newName));
            }
    
            // Check if newQuantity is provided and add the update quantity promise
            if (updates.newQuantity !== undefined) {
                updatePromises.push(updateRegisterComponentQuantity(oldComponentName, updates.newQuantity));
            }
    
            // Execute all update promises
            await Promise.all(updatePromises);
    
            toast.success('Component updated successfully', { autoClose: 2000 });
            fetchComponents(); // Refresh the list after successful update
            handleCloseUpdateModal();
            }catch(error){
                toast.error('Error updating component', { autoClose: 2000 });
            }
            
            })
            
        }else{
            
            const updatePromises = [];
    
            // Check if newName is provided and not the same as the old name
            if (updates.newName && updates.newName !== oldComponentName) {
                // Check if the new name already exists
                const existingComponents = await getRegisterComponents();
                const nameExists = existingComponents.some(component => component.componentName === updates.newName);
                
                try{
                    if (nameExists) {
                        //throw new Error('New component name already exists');
                        toast.warning('Component name aldready exixts', { autoClose: 2000 })
                }
                }catch(error){
                    console.log(error)
                }
                

                // Add the update name promise if the name is unique
                updatePromises.push(updateRegisterComponentName(oldComponentName, updates.newName));
            }
    
            // Check if newQuantity is provided and add the update quantity promise
            if (updates.newQuantity !== undefined) {
                updatePromises.push(updateRegisterComponentQuantity(oldComponentName, updates.newQuantity));
            }
    
            // Execute all update promises
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
    
    
    
    const handleDeleteComponent = async () => {
        try {
            await deleteRegisterComponent(componentToDelete);
            toast.success('Component deleted successfully', { autoClose: 2000 });
            fetchComponents();
            handleCloseConfirmModal();
        } catch (error) {
            toast.error('Error deleting component', { autoClose: 2000 });
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



    const fetchComponents = async () => {
        try {
            setLoading(true);
            const data = await getRegisterComponents();
            setComponents(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch components');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComponents();
    }, []);

    // Filter components based on search term
    const filteredComponents = components.filter(({ componentName }) =>
        componentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-screen flex flex-col bg-gradient-to-r from-teal-900 to-black">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-bold text-white">Register Components</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search components..."
                className=" p-2 pl-10 rounded-xl w-full bg-gray-400 bg-opacity-20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
            </div>
          </div>
          <button
            className="ml-4 bg-teal-500 bg-opacity-50 text-white text-bold py-2 px-2 rounded-md hover:bg-white hover:text-black transition duration-300 mb-4 self-start"
            onClick={handleOpenAddModal}
          >
            + Add Component
          </button>
          <div className="flex-grow bg-opacity-20 shadow-md rounded-lg overflow-hidden text-white">
            <ul className="p-4 h-full overflow-y-auto space-y-4"> {/* Added space between items */}
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : filteredComponents.length > 0 ? (
                filteredComponents.map(({ componentName, quantity }, index) => (
                  <li
                    key={index}
                    className="bg-white bg-opacity-10 shadow-md rounded-lg p-4 flex justify-between items-center  " // Added border
                  >
                    <span className="font-medium">{componentName}</span>
                    <div className="flex justify-between items-center space-x-4">
                      <span className="font-medium bg-teal-500 bg-opacity-50 w-24 h-8 flex items-center justify-center rounded-md">
                        {quantity}
                      </span>
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleOpenUpdateModal({ componentName, quantity })}
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button
                        className="text-red-400 hover:underline"
                        onClick={() => handleOpenConfirmModal(componentName)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className='text-white text-xl'>No components available</p>
              )}
            </ul>
          </div>
      
          <AddComponentModal
            isOpen={isAddModalOpen}
            onClose={handleCloseAddModal}
            onSubmit={handleSubmitComponent}
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
          <PasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            onSubmit={handlePasswordSubmit}
          />
        </div>
      );
      
};    
export default Components;
