import Project from "../models/user.project.model.js";

export const addProject = async (req, res) => {
    try {
        let { projectName } = req.body;

        if (!projectName || typeof projectName !== 'string') {
            return res.status(400).json({ error: 'Valid project name is required' });
        }

        const projectNameLower = projectName.toLowerCase();
        const formattedProjectName = projectName.charAt(0).toUpperCase() + projectName.slice(1).toLowerCase();

        // Check if projectName already exists
        const existingProject = await Project.findOne({ projectName: new RegExp('^' + projectNameLower + '$', 'i') });
        if (existingProject) {
            return res.status(400).json({ error: 'Project name already exists' });
        }

        const newProject = new Project({ projectName: formattedProjectName });

        try {
            await newProject.save();
        } catch (error) {
            console.error("Error saving project:", error);
            return res.status(500).json({ error: "Error saving project" });
        }
        
        res.status(201).json({ msg: 'Project saved successfully' });
    } catch (error) {
        console.log("Error in Project controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// export const addComponents = async (req, res) => {
//     try {
//         const { projectName } = req.params;
//         let { componentName, quantity } = req.body;

        
        // Capitalize the first letter of the component name

        // componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1).toLowerCase();


        // console.log("componentName=",componentName)
        // // Find the project
        // const project = await Project.findOne({ projectName });
        // console.log("project =",project);

        // if (!project) {
        //     return res.status(404).json({ error: 'Project not found' });
        // }

        // // Convert the component names in the map to lower case for case-insensitive comparison
        // const existingComponents = Array.from(project.components.keys()).map(name => name.toLowerCase());

        // // Check if the component already exists (case-insensitive)
        // if (existingComponents.includes(componentName.toLowerCase())) {
        //     return res.status(400).json({ error: 'Component already exists' });
        // }

        // // Add the new component
        // project.components.set(componentName, { name: componentName, quantity });
        // await project.save();

        // res.status(201).json({ msg: 'Component added successfully' });

//     } catch (error) {
//         console.error('Error in adding component:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


export const addComponents = async (req, res) => {
    try {
        const { projectName } = req.params; // Extract project name from URL parameters
        const { componentName, quantity } = req.body; // Extract component details from request body

        // Check if the project exists
        let project = await Project.findOne({ projectName });

        if (!project) {
            // If project does not exist, create a new project with only the project name
            project = new Project({ projectName });
            await project.save();

            return res.status(201).json({
                message: "Project created successfully",
                project: { projectName: project.projectName, components: project.components },
            });
        }

        // If componentName and quantity are provided, add the component
        if (componentName && quantity !== undefined) {
            // Check if the component already exists in the project
            const existingComponent = project.components.find(
                (component) => component.name.toLowerCase() === componentName.toLowerCase()
            );

            if (existingComponent) {
                return res.status(400).json({ error: "Component with this name already exists" });
            }

            // Add the new component
            project.components.push({ name: componentName, quantity });

            // Save the updated project
            await project.save();

            return res.status(200).json({
                message: "Component added successfully",
                project,
            });
        }

        // If no component details are provided, return the project with its current components
        return res.status(200).json({
            message: "Project retrieved successfully",
            project: { projectName: project.projectName, components: project.components },
        });
    } catch (error) {
        console.error("Error in adding component:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





export const getAllProjects = async (req, res) => {
    try {
        // Retrieve all projects from the database
        const projects = await Project.find({}, 'projectName');

        // Map the projects to an array of project names
        const projectNames = projects.map(project => project.projectName);

        // Respond with the list of project names
        res.status(200).json({ projectNames });
    } catch (error) {
        console.error("Error in fetching project names:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const deleteProject=async (req,res) => {
    try{
        const {projectName}=req.params;
        const project=await Project.findOneAndDelete({projectName});
        if(!project){
            return res.status(404).json({error:'Project not found'});
        }
        
        console.log("Project deleted successfully");
        res.status(201).json({message:"project deleted successfully"})
    }catch(error){
        console.error("Error in deleting project:",error.message);
    }
}

export const updateProjectName = async (req, res) => {
    try {
        const { projectName } = req.params;
        const { newProjectName } = req.body;

        if (!newProjectName || typeof newProjectName !== 'string') {
            return res.status(400).json({ error: 'Valid new project name is required' });
        }

        const existingProject = await Project.findOne({ projectName: newProjectName });
        if (existingProject) {
            return res.status(400).json({ error: 'New project name already exists' });
        }

        const project = await Project.findOne({ projectName });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        project.projectName = newProjectName;
        await project.save();

        res.status(200).json({ message: 'Project name updated successfully' });
    } catch (error) {
        console.error("Error updating project name:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getProjectComponents = async (req, res) => {
    try {
        const { projectName } = req.params;

        // Retrieve the project based on the project name
        const project = await Project.findOne({ projectName });

        // Check if the project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Respond with the project's components
        res.status(200).json({ components: project.components });
    } catch (error) {
        console.error("Error in fetching project components:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateComponentQuantity = async (req, res) => {
    const { projectName, componentName } = req.params;
    const { quantity } = req.body;

    try {
        // Find the project by projectName
        const project = await Project.findOne({ projectName });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Find the component within the project's components array
        const component = project.components.find(c => c.name === componentName);

        if (!component) {
            return res.status(404).json({ error: 'Component not found' });
        }

        // Update the component's quantity
        component.quantity = quantity;

        // Save the project with the updated component
        await project.save();

        res.status(200).json({
            message: 'Quantity updated successfully',
            component: component
        });

    } catch (error) {
        console.error('Error updating component quantity:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const updateComponentName = async (req, res) => {
    const { projectName, componentName } = req.params; // The current componentName
    let { newComponentName } = req.body; // The new name to be updated

    if (!newComponentName || typeof newComponentName !== 'string') {
        return res.status(400).json({ error: 'New component name is required and should be a string' });
    }

    // Capitalize the new component name
    newComponentName = newComponentName.charAt(0).toUpperCase() + newComponentName.slice(1).toLowerCase();

    try {
        // Find the project
        const project = await Project.findOne({ projectName });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Find the component by name within the components array
        const component = project.components.find(c => c.name === componentName);

        if (!component) {
            return res.status(404).json({ error: 'Component not found' });
        }

        // Check if the new component name already exists (case-insensitive)
        const nameExists = project.components.some(c => c.name.toLowerCase() === newComponentName.toLowerCase());

        if (nameExists) {
            return res.status(400).json({ error: 'New component name already exists' });
        }

        // Update the component name
        component.name = newComponentName;

        // Save the updated project
        await project.save();

        res.status(200).json({ message: 'Component name updated successfully' });
    } catch (error) {
        console.error('Error updating component name:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




// Delete component
export const deleteComponents= async (req, res) => {
    const { projectName, componentName } = req.params;

    try {
        const project = await Project.findOne({ projectName });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (!project.components.has(componentName)) {
            return res.status(404).json({ error: 'Component not found' });
        }

        project.components.delete(componentName);
        await project.save();

        res.status(200).json({ message: 'Component deleted successfully' });

    } catch (error) {
        console.error('Error deleting component:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
