import React, { useState, useEffect } from 'react';
import AddProjectModal from './AddProjectModal';
import UpdateProjectModal from './UpdateProjectModal';
import ConfirmationModal from './ConfirmationModal';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProjects, addProject, deleteProject, updateProject } from './projectApi';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './images/xyma.png';

const ProjectModal = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const navigate = useNavigate();

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenUpdateModal = (projectName) => {
    setSelectedProject(projectName);
    setIsUpdateModalOpen(true);
  };
  const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);

  const handleOpenConfirmModal = (projectName) => {
    setProjectToDelete(projectName);
    setIsConfirmModalOpen(true);
  };
  const handleCloseConfirmModal = () => setIsConfirmModalOpen(false);

  const handleSubmitProject = async (projectName) => {
    try {
      await addProject(projectName);
      toast.success('Project added successfully', { autoClose: 2000 });
      fetchProjects();
      handleCloseAddModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.warning('Project name already exists', { autoClose: 2000 });
      } else {
        toast.error('Error adding project', { autoClose: 2000 });
      }
    }
  };

  const handleUpdateProject = async (oldProjectName, newProjectName) => {
    try {
      await updateProject(oldProjectName, newProjectName);
      toast.success('Project updated successfully', { autoClose: 2000 });
      fetchProjects();
      handleCloseUpdateModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.warning('Project name already exists', { autoClose: 2000 });
      } else {
        toast.error('Error updating project', { autoClose: 2000 });
      }
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectToDelete);
      toast.success('Project deleted successfully', { autoClose: 2000 });
      fetchProjects();
      handleCloseConfirmModal();
    } catch (error) {
      toast.error('Error deleting project', { autoClose: 2000 });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      toast.success('Logout Successfully!!', { autoClose: 1000 });
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out', { autoClose: 1000 });
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getAllProjects();
      setProjects(response.data.projectNames);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch projects');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-r from-orange-950 to-red-900">
      <div className="flex-none h-1/5 flex justify-between items-start p-4">
        <div className='p-4 '>
          {/* <h1 className="text-3xl text-zinc-600 font-bold ">Project List</h1> */}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <button
            className="bg-yellow-600 shadow-md rounded-lg p-2 text-center cursor-pointer"
            onClick={handleOpenAddModal}
          >
            <span className="text-black font-bold ">+ Add Project</span>
          </button>
        </div>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16" /> {/* Adjust height as needed */}
        </div>
        <div className="flex flex-col items-end">
          {/* <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300 mb-2"
            onClick={handleLogout}
          >
            Logout
          </button>
           */}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto  p-4 rounded-lg shadow-md">
        <ul className="space-y-4">
          {projects.length > 0 ? (
            projects.map((projectName, index) => (
              <li
                key={index}
                className="bg-white bg-opacity-20 b shadow-md rounded-lg p-4 flex justify-between items-center text-white"
              >
                <Link to={`/projects/${projectName}`} className="text-xl font-bold">
                  {projectName}
                </Link>
                <div className="space-x-4">
                <button
                    className=" text-red-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click event from bubbling up
                      handleOpenConfirmModal(projectName);
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                  <button
                    className=" text-blue-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click event from bubbling up
                      handleOpenUpdateModal(projectName);
                    }}
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No projects available</p>
          )}
        
        </ul>
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleSubmitProject}
      />
      <UpdateProjectModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onSubmit={handleUpdateProject}
        oldProjectName={selectedProject}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleDeleteProject}
        message={`Are you sure you want to delete the project "${projectToDelete}"?`}
      />
    </div>
  );
};

export default ProjectModal;
