import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getAllProjects = () => {
  return axios.get(`${API_URL}/projects`, { withCredentials: true });
};

export const addProject = (projectName) => {
  return axios.post(`${API_URL}/addProject`, { projectName }, { withCredentials: true });
};

export const addComponent = (projectName, component) => {
  return axios.post(`${API_URL}/projects/${projectName}/components`, component, { withCredentials: true });
};

export const getProjectComponents = async (projectName) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectName}/components`, { withCredentials: true });
   
    return response.data ;
  } catch (error) {
    console.error('Error fetching project components:', {
      message: error.message,
      config: error.config,
      code: error.code,
      response: error.response ? error.response.data : null,
    });
    throw error;
  }
};
// const getProjectComponents = async (projectName) => {
//   try {
//       const response = await axios.get(`/api/projects/${projectName}/components`);
//       // Extract the components array from the response
//       return response.data.components || []; // Return an empty array if components is undefined
//   } catch (error) {
//       console.error('Error fetching project components:', error);
//       throw error;
//   }
// };



export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return { msg: 'Logout successful' };
  } catch (error) {
    console.error('Error during logout:', error);
    throw error; // or handle the error as needed
  }
};

export const deleteProject = async (projectName) => {
  return axios.delete(`${API_URL}/projects/${projectName}`);
};



export const updateProject = async (oldProjectName, newProjectName) => {
  try {
    const response = await axios.put(`c/projects/${oldProjectName}`, {
      newProjectName
    }, { withCredentials: true });
    return response;
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : 'An error occurred');
  }
};

export const validatePassword = async ({ username, password }) => {
  const response = await axios.post('http://localhost:5000/auth/validate-password', {
      username,
      password,
  });
  return response.data;
};

export const getRegisterComponents = async () => {
  try {
      const response = await axios.get(`${API_URL}/getRegisterComponents`);
      return response.data.components; // Adjust based on API response structure
  } catch (error) {
      console.error('Error fetching components:', error);
      throw new Error('Error fetching components');
  }
}

export const addRegisterComponent = async (componentName, quantity) => {
  try {
      const response = await axios.post(`${API_URL}/addRegisterComponents`, { componentName, quantity });
      return response.data; // The response may include the saved component or other details
  } catch (error) {
      console.error('Error adding component:', error);
      throw new Error('Error adding component');
  }
};

export const updateRegisterComponentName = async ( componentName, newComponentName) => {
  try {
      const response = await axios.put(`${API_URL}/components/${componentName}/name`, {
          newComponentName
      });
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.error || 'Error updating component name');
  }
};

export const updateComponentName = async (projectName, componentName, newComponentName) => {
  try {
    const response = await axios.put(
      `${API_URL}/projects/${projectName}/components/${componentName}/name`,
      { newComponentName },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating component name:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to update component name');
  }
};


export const updateRegisterComponentQuantity = async ( componentName, quantity) => {
  try {
      const response = await axios.put(`${API_URL}/components/${componentName}/quantity`, {
          quantity
      });
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.error || 'Error updating component quantity');
  }
};



export const updateComponentQuantity = async (projectName, componentName, quantity) => {
  try {
    const response = await axios.put(
      `${API_URL}/projects/${projectName}/components/${componentName}`,
      { quantity },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating component quantity:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to update component quantity');
  }
};


export const deleteRegisterComponent=async(componentName)=>{
  return axios.delete(`${API_URL}/components/${componentName}`)
}


// projectApi.js
export const deleteComponents = async (projectName, componentName) => {
  try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectName}/components/${componentName}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
  } catch (error) {
      console.error('Error deleting components:', error);
      throw error;
  }
};
