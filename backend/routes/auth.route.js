import express from "express";
import {login,signup,logout,checkSession} from "../controller/login.controller.js"
import {addProject,addComponents,getAllProjects,getProjectComponents,deleteProject,updateProjectName,updateComponentName,deleteComponents,updateComponentQuantity} from "../controller/project.controller.js"

import { getRegisterComponents,addRegisterComponents,updateRegisterComponentName,updateRegisterComponentQuantity,deleteRegisterComponent } from "../controller/components.controller.js";

const router=express.Router();


router.post("/login",login);

router.post("/signup",signup);

router.post('/logout',logout);

router.post("/addProject",addProject);

//router.post("/addComponents/:projectName",addComponents);

router.post("/projects/:projectName/components", addComponents);

router.get("/projects/:projectName/components", getProjectComponents);

router.get("/projects",getAllProjects);

router.put("/projects/:projectName/components/:componentName",updateComponentQuantity)

router.delete("/projects/:projectName",deleteProject);

router.delete("/checkSession",checkSession);

router.put("/projects/:projectName",updateProjectName);

router.get("/getRegisterComponents",getRegisterComponents);

router.post("/addRegisterComponents",addRegisterComponents);

router.put("/components/:componentName/name",updateRegisterComponentName);

router.put('/components/:componentName/quantity', updateRegisterComponentQuantity);

router.delete('/components/:componentName', deleteRegisterComponent); 

// Update component quantity
router.put('/projects/:projectName/components/:componentName/quantity', updateComponentQuantity);

// Update component name
router.put('/projects/:projectName/components/:componentName/name', updateComponentName);

// Delete component
router.delete('/projects/:projectName/components/:componentName', deleteComponents);

router.post('/validate-password', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Password validated successfully' });
    } catch (error) {
        console.error('Error validating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;