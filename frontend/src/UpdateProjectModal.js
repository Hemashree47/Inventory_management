import React, { useState,useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProjectModal = ({ isOpen, onClose, onSubmit, oldProjectName }) => {
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewProjectName(''); // Reset the new project name when the modal is opened
    }
  }, [isOpen, oldProjectName]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProjectName && newProjectName !== oldProjectName) {
      onSubmit(oldProjectName, newProjectName);
    } else {
      toast.warning('New project name cannot be empty or same as oldProjectName',{
        autoClose:2000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Update Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="new-project-name">
              New Project Name
            </label>
            <input
              id="new-project-name"
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="New Project Name"
              required
              className="w-full border-gray-300 rounded-lg p-2"
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

export default UpdateProjectModal;

// import React, { useState, useEffect } from 'react';
// import AddComponentModal from '../AddComponentModal';
// import UpdateComponentModal from '../updateComponentModal';
// import UpdateQuantityModal from '../UpdateQuantityModal'; // New modal for updating quantity
// import ConfirmComponentModal from '../ConfirmComponentModal';
// import PasswordModal from '../PasswordModal';
// import {
//     getRegisterComponents,
//     addRegisterComponent,
//     updateRegisterComponentName,
//     updateRegisterComponentQuantity,
//     deleteRegisterComponent
// } from '../projectApi'; // Adjust the import path
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const FIXED_PASSWORD = '0000';
// const Components = () => {
//     const [components, setComponents] = useState([]);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//     const [isUpdateQuantityModalOpen, setIsUpdateQuantityModalOpen] = useState(false);
//     const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//     const [selectedComponent, setSelectedComponent] = useState(null);
//     const [componentToDelete, setComponentToDelete] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [pendingAction, setPendingAction] = useState(null);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

//     const handleOpenAddModal = () => setIsAddModalOpen(true);
//     const handleCloseAddModal = () => setIsAddModalOpen(false);

//     const handleOpenUpdateModal = (componentName) => {
//         setSelectedComponent(componentName);
//         setIsUpdateModalOpen(true);
//     };
//     const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);

//     const handleOpenUpdateQuantityModal = (componentName, quantity) => {
//         setSelectedComponent({ componentName, quantity });
//         setIsUpdateQuantityModalOpen(true);
//     };
//     const handleCloseUpdateQuantityModal = () => setIsUpdateQuantityModalOpen(false);

//     const handleOpenConfirmModal = (componentName) => {
//         setComponentToDelete(componentName);
//         setIsConfirmModalOpen(true);
//     };
//     const handleCloseConfirmModal = () => setIsConfirmModalOpen(false);

//     const handleSubmitComponent = async (componentName, quantity) => {
//         try {
//             await addRegisterComponent(componentName, quantity);
//             toast.success('Component added successfully', { autoClose: 2000 });
//             fetchComponents();
//             handleCloseAddModal();
//         } catch (error) {
//             toast.error('Error adding component', { autoClose: 2000 });
//         }
//     };

//     const handleUpdateComponent = async (oldComponentName, newComponentName) => {
//         try {
//             await updateRegisterComponentName(oldComponentName, newComponentName);
//             toast.success('Component updated successfully', { autoClose: 2000 });
//             fetchComponents();
//             handleCloseUpdateModal();
//         } catch (error) {
//             if (error.response && error.response.status === 400) {
//                 toast.warning('Component name already exists', { autoClose: 2000 });
//             } else {
//                 toast.error('Error updating component', { autoClose: 2000 });
//             }
//         }
//     };

//     const handleDeleteComponent = async () => {
//         try {
//             await deleteRegisterComponent(componentToDelete);
//             toast.success('Component deleted successfully', { autoClose: 2000 });
//             fetchComponents();
//             handleCloseConfirmModal();
//         } catch (error) {
//             toast.error('Error deleting component', { autoClose: 2000 });
//         }
//     };

//     const askForPassword = (action) => {
//         setPendingAction(() => action);
//         setIsPasswordModalOpen(true);
//     };

//     const handlePasswordSubmit = (enteredPassword) => {
//         if (enteredPassword === FIXED_PASSWORD) {
//             setIsAuthenticated(true);
//             setIsPasswordModalOpen(false);
//             if (pendingAction) {
//                 pendingAction();
//                 setPendingAction(null);
//             }
//         } else {
//             toast.error('Incorrect password', { autoClose: 2000 });
//             setIsPasswordModalOpen(false);
//         }
//     };

//     const handleQuantityUpdate = (componentName, quantity) => {
//         if (!isAuthenticated) {
//             askForPassword(() => {
//                 updateRegisterComponentQuantity(componentName, quantity)
//                     .then(() => {
//                         fetchComponents();
//                     })
//                     .catch(error => {
//                         console.error('Error updating component quantity:', error);
//                         toast.error(error.message || 'Error updating component quantity', { autoClose: 2000 });
//                     });
//             });
//         } else {
//             updateRegisterComponentQuantity(componentName, quantity)
//                 .then(() => {
//                     fetchComponents();
//                 })
//                 .catch(error => {
//                     console.error('Error updating component quantity:', error);
//                     toast.error(error.message || 'Error updating component quantity', { autoClose: 2000 });
//                 });
//         }
//     };

//     const fetchComponents = async () => {
//         try {
//             setLoading(true);
//             const data = await getRegisterComponents();
//             setComponents(data);
//             setLoading(false);
//         } catch (error) {
//             setError('Failed to fetch components');
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchComponents();
//     }, []);

//     return (
//         <div className="w-full h-screen flex flex-col bg-gradient-to-r from-teal-200 via-pink-200 to-yellow-200">
//             <div className="flex justify-between items-center p-4">
//                 <h2 className="text-2xl font-bold">Register Components</h2>
//                 <button
//                     className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
//                     onClick={handleOpenAddModal}
//                 >
//                     + Add Component
//                 </button>
//             </div>
//             <div className="flex-grow overflow-y-auto bg-white shadow-md rounded-lg p-4">
//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : error ? (
//                     <p className="text-red-500">{error}</p>
//                 ) : components.length > 0 ? (
//                     components.map(({ componentName, quantity }, index) => (
//                         <div key={index} className="flex justify-between items-center py-2">
//                             <span>{componentName}</span>
//                             <span>Quantity: {quantity}</span>
//                             <button
//                                 className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-700 transition duration-300"
//                                 onClick={() => handleOpenUpdateQuantityModal(componentName, quantity)}
//                             >
//                                 Update Quantity
//                             </button>
//                             <button
//                                 className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700 transition duration-300"
//                                 onClick={() => handleOpenUpdateModal(componentName)}
//                             >
//                                 Update Name
//                             </button>
//                             <button
//                                 className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-300"
//                                 onClick={() => handleOpenConfirmModal(componentName)}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No components available. Add some!</p>
//                 )}
//             </div>

//             {/* Modals */}
//             <AddComponentModal
//                 isOpen={isAddModalOpen}
//                 onClose={handleCloseAddModal}
//                 onSubmit={handleSubmitComponent}
//             />
//             <UpdateComponentModal
//                 isOpen={isUpdateModalOpen}
//                 onClose={handleCloseUpdateModal}
//                 onSubmit={handleUpdateComponent}
//                 oldComponentName={selectedComponent}
//             />
//             <UpdateQuantityModal
//                 isOpen={isUpdateQuantityModalOpen}
//                 onClose={handleCloseUpdateQuantityModal}
//                 onSubmit={handleQuantityUpdate}
//                 componentName={selectedComponent?.componentName}
//                 currentQuantity={selectedComponent?.quantity}
//             />
//             <ConfirmComponentModal
//                 isOpen={isConfirmModalOpen}
//                 onClose={handleCloseConfirmModal}
//                 onConfirm={handleDeleteComponent}
//                 componentName={componentToDelete}
//             />
//             <PasswordModal
//                 isOpen={isPasswordModalOpen}
//                 onClose={() => setIsPasswordModalOpen(false)}
//                 onSubmit={handlePasswordSubmit}
//             />
//         </div>
//     );
// };

// export default Components;
