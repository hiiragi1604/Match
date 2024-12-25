import express, { Request, Response } from 'express';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, searchProjects} from "../controllers/projectController";

const ProjectRouter = express.Router();

// Test route
ProjectRouter.get("/test", (req: Request, res: Response) => {
    res.send("Project route is working");
});


// GET all projects
ProjectRouter.get("/all", getAllProjects);

// GET a project by ID
ProjectRouter.get("/getById/:id", getProjectById);

// POST a new project
ProjectRouter.post("/create", createProject);

// PUT (update) a project by ID
ProjectRouter.put("/update/:id", updateProject);

// DELETE a project by ID
ProjectRouter.delete("/delete/:id", deleteProject);

// Search projects
ProjectRouter.get("/search", searchProjects);

export default ProjectRouter;
