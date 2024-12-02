// import React, { useEffect, useState } from 'react';
// import { getAllProjects } from './projectApi';

// const ProjectList = () => {
//   const [projects, setProjects] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await getAllProjects();
//         setProjects(response.projectNames);
//       } catch (err) {
//         setError(err.response?.data?.error || 'An error occurred');
//       }
//     };

//     fetchProjects();
//   }, []);

//   return (
//     <div>
//       <h2>Project List</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <ul>
//         {projects.map((project) => (
//           <li key={project}>{project}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProjectList;

