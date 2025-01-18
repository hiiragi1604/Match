import express, { Request, Response } from 'express';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, searchProjects, applyToProject, updateApplicationStatus, setRoleForProjectMember} from "../controllers/projectController";

const ProjectRouter = express.Router();

// Test route
ProjectRouter.get("/test", (req: Request, res: Response) => {
    res.send("Project route is working");
});


// GET all projects
ProjectRouter.get("/all", getAllProjects);

// GET a project by ID
ProjectRouter.get("/getById/:id", getProjectById);

// Search projects
ProjectRouter.get("/search", searchProjects);


// POST a new project
ProjectRouter.post("/create", createProject);

// Apply to a project
ProjectRouter.post("/apply", applyToProject);


// PUT (update) a project by ID
ProjectRouter.put("/update", updateProject);

// Update application status
ProjectRouter.put("/updateApplication", updateApplicationStatus);

// Set project role
ProjectRouter.put("/setRole", setRoleForProjectMember);



// DELETE a project by ID
ProjectRouter.delete("/delete", deleteProject);



export default ProjectRouter;
