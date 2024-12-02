import React, { useState, useEffect } from 'react';
// import AddProjectModal from '../AddProjectModal';
// import UpdateProjectModal from '../UpdateProjectModal';
// import ConfirmationModal from '../ConfirmationModal';
import { Link } from 'react-router-dom';
import { getAllProjects } from '../projectApi';

import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/xyma.png';

const ProjectModal2 = () => {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  

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
    <div className="w-full h-screen flex flex-col bg-gradient-to-r from-pink-700 to-blue-800">
      <div className="flex-none h-1/5 flex justify-between items-start p-4">
        <div className='p-4 '>
          {/* <h1 className="text-3xl text-zinc-600 font-bold ">Project List</h1> */}
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {/* <button
            className="bg-pink-900 shadow-md rounded-lg p-2 text-center cursor-pointer"
            onClick={handleOpenAddModal}
          >
            <span className="text-white font-bold">+ Add Project</span>
          </button> */}
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
          </button> */}
          
        </div>
      </div>
      <div className="flex-grow overflow-y-auto  p-4 rounded-lg shadow-md">
        <ul className="space-y-4">
          {projects.length > 0 ? (
            projects.map((projectName, index) => (
              <li
                key={index}
                className="bg-white bg-opacity-40 text-white  shadow-md rounded-lg p-4 flex justify-between items-center"
              >
                <Link to={`/projects/${projectName}/available`} className="text-xl font-bold">
                  {projectName}
                </Link>
                <div className="space-x-4">
                {/* <button
                    className="text-red-400 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click event from bubbling up
                      handleOpenConfirmModal(projectName);
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button> */}
                  {/* <button
                    className="text-blue-500 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click event from bubbling up
                      handleOpenUpdateModal(projectName);
                    }}
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button> */}

                </div>
              </li>
            ))
          ) : (
            <p>No projects available</p>
          )}
        
        </ul>
      </div>

      {/* <AddProjectModal
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
      /> */}
    </div>
  );
};

export default ProjectModal2;
