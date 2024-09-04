import userComponents from "../models/user.total.components.js"


export const getRegisterComponents = async (req, res) => {
    try {
        const components = await userComponents.find({}, 'componentName quantity');
        res.json({ components });
    } catch (error) {
        console.error("Error fetching components:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addRegisterComponents = async (req, res) => {
    

    

    try {
        let { componentName, quantity } = req.body;
        
        // Convert componentName to lowercase for case-insensitive comparison
        const componentNameLower = componentName.toLowerCase();

        // Capitalize the first letter of the component name
        componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1).toLowerCase();

        // Check if a component with the same name (case-insensitive) already exists
        const existingComponent = await userComponents.findOne({ componentName: new RegExp('^' + componentNameLower + '$', 'i') });

        if (existingComponent) {
            return res.status(400).json({ error: 'Component name already exists' });
        }

        // Create and save the new component
        const newComponent = new userComponents({
            componentName,
            quantity,
        });

        await newComponent.save();
        res.status(201).json({ message: 'Component added successfully' });

    } catch (error) {
        console.error('Error adding component:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const updateRegisterComponentQuantity = async (req, res) => {
    const { componentName } = req.params;
    const { quantity } = req.body;
    try {
        const component = await userComponents.findOne({ componentName });
        if (!component) {
            return res.status(404).json({ error: 'Component not found' });
        }

        // Ensure quantity is a non-negative number
        component.quantity = Math.max(parseInt(quantity, 10) || 0, 0);

        await component.save();
        res.status(200).json({ message: 'Component quantity updated successfully' });
    } catch (error) {
        console.error("Error updating component quantity:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const deleteRegisterComponent = async (req, res) => {
    const { componentName } = req.params;

    try {
        const result = await userComponents.findOneAndDelete({ componentName });

        if (!result) {
            return res.status(404).json({ error: 'Component not found' });
        }

        res.status(200).json({ message: 'Component deleted successfully' });
    } catch (error) {
        console.error('Error deleting component:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateRegisterComponentName = async (req, res) => {
    const { componentName } = req.params; // Current component name
    let { newComponentName } = req.body; // New name to update

    try {
        // Validate the new component name
        if (!newComponentName || typeof newComponentName !== 'string') {
            return res.status(400).json({ error: 'Valid new component name is required' });
        }

        // Capitalize the new component name
        newComponentName = newComponentName.charAt(0).toUpperCase() + newComponentName.slice(1).toLowerCase();

        // Check if the new component name already exists (case-insensitive)
        const existingComponent = await userComponents.findOne({ componentName: { $regex: new RegExp(`^${newComponentName}$`, 'i') } });
        if (existingComponent) {
            return res.status(400).json({ error: 'New component name already exists' });
        }

        // Find the component by the original name
        const component = await userComponents.findOne({ componentName });
        if (!component) {
            return res.status(404).json({ error: 'Component not found' });
        }

        // Update the component name
        component.componentName = newComponentName;
        await component.save();

        res.status(200).json({ message: 'Component name updated successfully' });
    } catch (error) {
        console.error("Error updating component name:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
