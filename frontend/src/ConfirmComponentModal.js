// ConfirmationModal.js
import React from 'react';
import Modal from 'react-modal'; // Ensure this import is correct

const ConfirmComponentModal = ({ isOpen, onClose, onConfirm, message }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    contentLabel="Confirm Delete"
    className="fixed inset-0 flex items-center justify-center p-4"
    overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50"
  >
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">{message}</h2>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
          onClick={onConfirm}
        >
          Yes
        </button>
        <button
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-500"
          onClick={onClose}
        >
          No
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmComponentModal;





// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import AddComponentModal from './AddComponentModal';
// import PasswordModal from './PasswordModal';
// import ConfirmComponentModal from './ConfirmComponentModal';
// import UpdateComponentModal from './updateComponentModal';
// import { getProjectComponents, addComponent, updateComponentQuantity, deleteComponents, updateComponentName } from './projectApi';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// const FIXED_PASSWORD = "0000"


// const ProjectComponentsPage = () => {
//     const { projectName } = useParams();
//     const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
//     const [components, setComponents] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//     const [pendingAction, setPendingAction] = useState(null); // Track pending actions
//     const [searchTerm, setSearchTerm] = useState(''); // State for search term
//     const [componentToDelete, setComponentToDelete] = useState(null);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//     const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//     const [selectedComponent, setSelectedComponent] = useState(null);

//     const handleOpenComponentModal = () => setIsComponentModalOpen(true);
//     const handleCloseComponentModal = () => setIsComponentModalOpen(false);

//     const handleOpenUpdateModal = (component) => {
//         setSelectedComponent(component); // Ensure component has the structure {componentName, quantity}
//         setIsUpdateModalOpen(true);
//     };
//     const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);

//     const handleOpenConfirmModal = (componentName) => {
//         setComponentToDelete(componentName); // Set the component name to delete
//         setIsConfirmModalOpen(true);
//     };
    
//     const handleCloseConfirmModal = () => setIsConfirmModalOpen(false);


//     const handleSubmitComponent = async (componentName, quantity) => {
//         try {
//             await addComponent(projectName, { componentName, quantity });
//             toast.success('Component added successfully',{
//                 autoClose:2000,
//             });
//             await fetchComponents(); // Refresh the component list
//             handleCloseComponentModal();
//         } catch (error) {
//             console.error('Error adding component:', error);
//             toast.error('Error adding component', { autoClose: 2000 });
//         }
//     };

//     const askForPassword = (action) => {
//         setPendingAction(() => action); // Set the action to be performed after authentication
//         setIsPasswordModalOpen(true); // Open the password modal
//     };

//     const handlePasswordSubmit = (enteredPassword) => {
//         if (enteredPassword === FIXED_PASSWORD) {
//             setIsAuthenticated(true);
//             setIsPasswordModalOpen(false);
//             if (pendingAction) {
//                 pendingAction(); // Perform the pending action after successful authentication
//                 setPendingAction(null); // Clear the pending action
//             }
//         } else {
//             toast.error('Incorrect password', { autoClose: 2000 });
//             setIsPasswordModalOpen(false); // Close the modal on error
//         }
//     };

//     const handleDeleteComponent = async () => {
//         try {
//             await deleteComponents(projectName, componentToDelete);
//             toast.success('Component deleted successfully', { autoClose: 2000 });
//             fetchComponents();
//             handleCloseConfirmModal();
//         } catch (error) {
//             toast.error('Error deleting component', { autoClose: 2000 });
//         }
//     };
    
//     // const handleUpdateComponent = async (oldComponentName, updates) => {
//     //     try {
//     //         console.log('Updating component:', oldComponentName, updates); // Log values
    
//     //         const updatePromises = [];
    
//     //         // Check if newName is provided and not the same as the old name
//     //         if (updates.newName && updates.newName !== oldComponentName) {
//     //             const existingComponents = await getProjectComponents();
//     //             const nameExists = existingComponents.some(component => component.componentName === updates.newName);
    
//     //             if (nameExists) {
//     //                 throw new Error('New component name already exists');
//     //             }
    
//     //             updatePromises.push(updateComponentName(oldComponentName, updates.newName));
//     //         }
    
//     //         if (updates.newQuantity !== undefined) {
//     //             updatePromises.push(updateComponentQuantity(projectName, oldComponentName, updates.newQuantity));
//     //         }
    
//     //         await Promise.all(updatePromises);
    
//     //         toast.success('Component updated successfully', { autoClose: 2000 });
//     //         fetchComponents(); // Refresh the list after successful update
//     //         handleCloseUpdateModal();
//     //     } catch (error) {
//     //         console.error('Error updating component:', error);
//     //         if (error.response && error.response.status === 400) {
//     //             toast.warning('Component name already exists', { autoClose: 2000 });
//     //         } else {
//     //             toast.error('Error updating component', { autoClose: 2000 });
//     //         }
//     //     }
//     // };

//     const handleUpdateComponent = async (oldComponentName, updates) => {
//       if(!isAuthenticated){
//         askForPassword(()=>{
//           console.log('Updating component:', oldComponentName, updates); // Log values
    
//             const updatePromises = [];
    
//             // Check if newName is provided and not the same as the old name
//             if (updates.newName && updates.newName !== oldComponentName) {
//                 const existingComponents =  getProjectComponents();
//                 const nameExists = existingComponents.some(component => component.componentName === updates.newName);
    
//                 if (nameExists) {
//                     throw new Error('New component name already exists');
//                 }
    
//                 updatePromises.push(updateComponentName(oldComponentName, updates.newName));
//             }
    
//             if (updates.newQuantity !== undefined) {
//                 updatePromises.push(updateComponentQuantity(projectName, oldComponentName, updates.newQuantity));
//             }
    
//             await Promise.all(updatePromises);
    
//             toast.success('Component updated successfully', { autoClose: 2000 });
//             fetchComponents(); // Refresh the list after successful update
//             handleCloseUpdateModal();
//         }).catch(error)=>{
//           console.error('Error updating component:', error);
//           toast.error(error.message || 'Error updating component', { autoClose: 2000 });
//         }
//       }else{
//         askForPassword(()=>{
//           console.log('Updating component:', oldComponentName, updates); // Log values
    
//             const updatePromises = [];
    
//             // Check if newName is provided and not the same as the old name
//             if (updates.newName && updates.newName !== oldComponentName) {
//                 const existingComponents = await getProjectComponents();
//                 const nameExists = existingComponents.some(component => component.componentName === updates.newName);
    
//                 if (nameExists) {
//                     throw new Error('New component name already exists');
//                 }
    
//                 updatePromises.push(updateComponentName(oldComponentName, updates.newName));
//             }
    
//             if (updates.newQuantity !== undefined) {
//                 updatePromises.push(updateComponentQuantity(projectName, oldComponentName, updates.newQuantity));
//             }
    
//             await Promise.all(updatePromises);
    
//             toast.success('Component updated successfully', { autoClose: 2000 });
//             fetchComponents(); // Refresh the list after successful update
//             handleCloseUpdateModal();
//         }).catch(error)=>{
//           console.error('Error updating component:', error);
//           toast.error(error.message || 'Error updating component', { autoClose: 2000 });
//         }
//       }
//     }


//     const fetchComponents = async () => {
//         try {
//             const response = await getProjectComponents(projectName);
//             setComponents(response.components || {}); // Ensure components is always an object
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching components:', error);
//             setError('Failed to fetch components');
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchComponents();
//     }, [projectName]);

//     const filteredComponents = Object.entries(components).filter(([componentName]) =>
//         componentName.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="w-full h-screen flex flex-col bg-blue-100">
//             <div className="flex justify-between items-center p-4">
//                 <h2 className="text-2xl font-bold">components for {projectName}</h2>
//                 <div className='relative'>
//                     <input
//                         type="text"
//                         placeholder="Search components..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="border p-2 pl-10 rounded-xl w-full"
//                     />
//                     <i className="fas fa-search absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"></i>
//                 </div>
//             </div>
//             <button
//                 className="ml-4 bg-blue-500 text-white text-bold py-2 px-2 rounded hover:bg-blue-700 transition duration-300 mb-4 self-start"
//                 onClick={handleOpenComponentModal}
//             >
//                 Add Component
//             </button>
//             {loading && <p>Loading...</p>}
//             {error && <p className="text-red-500">{error}</p>}
//             <div className="flex-grow bg-white shadow-md rounded-lg overflow-hidden">
//                 <ul className="p-4 h-full overflow-y-auto bg-gradient-to-r from-mint to-pink-100">
//                     {filteredComponents.length > 0 ? (
//                         filteredComponents.map(([componentName, { quantity }]) => (
//                             <div key={componentName} className="border-b last:border-none py-2 flex justify-between items-center">
//                                 <span className="font-medium">{componentName}</span>
//                                 {/* <input
//                                     type="number"
//                                     value={quantity}
//                                     onChange={(e) => handleQuantityUpdate(componentName, parseInt(e.target.value))}
//                                     className="border rounded w-16 p-1 text-center"
//                                     min="0"
//                                 /> */}
                                
//                                 {/* <button
//                                         className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
//                                         onClick={() => handleDeleteComponent(componentName)}
//                                     >
//                                         Delete
//                                     </button> */}


//                                     <div className="flex justify-between items-center py-2 space-x-2">
//                                         <span className="font-medium border border-gray-300 w-24 h-8 flex items-center justify-center rounded-md">
//                                             {quantity}
//                                         </span>

//                                         <button
//                                         className="text-blue-500 hover:underline"
//                                         onClick={() => handleOpenUpdateModal({ componentName, quantity })}
//                                     >
//                                         <i className="fas fa-pencil-alt"></i>
//                                     </button>

//                                         <button
//                                         className="text-red-400 hover:underline"
//                                         onClick={() => handleOpenConfirmModal(componentName)}
//                                         >
//                                         <i className="fas fa-trash-alt"></i>
//                                     </button>
//                                     </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-gray-900">No components available</p>
//                     )}
//                 </ul>
//             </div>
//             <AddComponentModal
//                 isOpen={isComponentModalOpen}
//                 onClose={handleCloseComponentModal}
//                 onSubmit={handleSubmitComponent}
//             />
//             <PasswordModal
//                 isOpen={isPasswordModalOpen}
//                 onClose={() => setIsPasswordModalOpen(false)}
//                 onSubmit={handlePasswordSubmit}
//             />

//             <UpdateComponentModal
//                 isOpen={isUpdateModalOpen}
//                 onClose={handleCloseUpdateModal}
//                 onSubmit={handleUpdateComponent}
//                 component={selectedComponent}
//             />

//             <ConfirmComponentModal
//                 isOpen={isConfirmModalOpen}
//                 onClose={handleCloseConfirmModal}
//                 onConfirm={handleDeleteComponent}
//                 message={`Are you sure you want to delete the component "${componentToDelete}"?`}
//             />

//         </div>
//     );
// };

// export default ProjectComponentsPage;
