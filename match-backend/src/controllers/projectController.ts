import { Request, Response, NextFunction } from "express";
import Project from "../models/Project";
import User from "../models/User";
import { getUserRoleInProject } from "../utils/getProjectRole";
import mongoose from "mongoose";

// Get all projects
export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

// Get project by ID
export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.status(200).json(project);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            res.status(400).json({ message: "Invalid project ID" });
            return;
        }
        next(error);
    }
};

// Create a new project
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            res.status(400).json({ message: "Project data is required" });
            return;
        }
        const userId = req.body.userId;
        const projectData = {
            ...req.body,
            members: [{ user: userId, role: 'Owner' }]
        };
        const project = await Project.create(projectData);
        await User.findByIdAndUpdate(userId, {
            $push: { projectsOwned: project._id }
        },{runValidators: false, new: true});
        res.status(201).json(project);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ message: "Invalid project data" });
            return;
        }
        next(error);
    }
};

// Update a project by ID
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.body;
        const { role, error } = await getUserRoleInProject(userId, projectId);
        
        if (error) {
            res.status(404).json({ message: error });
            return;
        }

        if (role !== 'Owner') {
            res.status(403).json({ message: 'You do not have permission to update this project' });
            return;
        }

        const project = await Project.findByIdAndUpdate(projectId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        res.status(200).json(project);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ message: 'Invalid project data' });
            return;
        }
        next(error);
    }
};


// Delete a project by ID
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId } = req.body; 
        const { role, error } = await getUserRoleInProject(userId, projectId);
        
        if (error) {
            res.status(404).json({ message: error });
            return;
        }

        if (role !== 'Owner') {
            res.status(403).json({ message: 'You do not have permission to delete this project' });
            return;
        }
        const project = await Project.findByIdAndDelete(projectId); 
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        await User.findByIdAndUpdate(userId, {
            $pull: { projectsOwned: projectId }
        });
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Apply to a project
export const applyToProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, projectId } = req.body;
  
      const project = await Project.findById(projectId);
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return 
      }
  
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return 
      }
  
      const alreadyApplied = user.appliedProjects.some(
        (application) => application.projectId.toString() === projectId
      );
      if (alreadyApplied) {
        res.status(400).json({ message: "User has already applied to this project" });
        return 
      }
  
      const application = {
        projectId: projectId,
        status: 'Pending' 
      };
  
      user.appliedProjects.push(application);

      
      project.applicants.push(userId);
  
      await user.save();
      await project.save();
  
      res.status(201).json({ message: "Successfully applied to the project" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

// Approve or reject a project application
export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, projectId, status, ownerId } = req.body;

        if (!userId || !projectId || !status || !ownerId) {
            res.status(400).json({ message: "Missing required fields" });
            return 
        }

        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return 
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return 
        }

        const { role, error } = await getUserRoleInProject(ownerId, projectId);
        if (error) {
            res.status(404).json({ message: error });
            return 
        }
        if (role !== 'Owner' && role !== 'Admin') {
            res.status(403).json({ message: 'You do not have permission to perform this operation' });
            return 
        }

        if (status !== 'Approved' && status !== 'Rejected') {
            res.status(400).json({ message: "Invalid status. Allowed values are 'Approved' or 'Rejected'" });
            return 
        }

        if (status === 'Approved') {
            project.members.push({ user: userId, role: 'Member' });
        
            user.technicalInfo.pastMatchProjects.push(projectId);
        
            const application = user.appliedProjects.find(
                (app) => app.projectId.toString() === projectId
            );
            if (application) {
                application.status = 'Approved';
            }
        
            project.applicants = project.applicants.filter(
                (applicant) => applicant.toString() !== userId
            );
        } else if (status === 'Rejected') {
            const application = user.appliedProjects.find(
                (app) => app.projectId.toString() === projectId
            );
            if (application) {
                application.status = 'Rejected';
            }
        
            project.applicants = project.applicants.filter(
                (applicant) => applicant.toString() !== userId
            );
        }

        await project.save();
        await user.save();

        res.status(200).json({ message: "Application status updated successfully" });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Set role for a project member
export const setRoleForProjectMember = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {projectId, memberId, memberRole, ownerId } = req.body;

        if (!projectId || !memberId || !memberRole || !ownerId) {
            res.status(400).json({ message: "Missing required fields" });
            return 
        }

        const project = await Project.findById(projectId);

        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return 
        }

        const user = await User.findById(memberId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return 
        }

        const { role, error } = await getUserRoleInProject(ownerId, projectId);
        if (error) {
            res.status(404).json({ message: error });
            return 
        }

        if (role !== 'Owner') {
            res.status(403).json({ message: 'You do not have permission to perform this operation' });
            return 
        }

        const member = project.members.find((member) => member.user.toString() === memberId);

        if (!member) {
            res.status(404).json({ message: "User is not a member of the project" });
            return 
        }

        if(memberRole === 'Owner'){
            res.status(400).json({ message: "Cannot set role as Owner" });
            return
        }

        member.role = memberRole;

        await project.save();
        res.status(200).json({ message: "Member role updated successfully" });
    }catch (error) {
        console.error(error);
        next(error);
    }
}

// Kick a member out of a project
export const kickMember = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {projectId, memberId, ownerId } = req.body;

        if (!projectId || !memberId || !ownerId) {
            res.status(400).json({ message: "Missing required fields" });
            return 
        }

        const project = await Project.findById(projectId);

        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return 
        }

        const { role, error } = await getUserRoleInProject(ownerId, projectId);
        if (error) {
            res.status(404).json({ message: error });
            return 
        }

        if (role !== 'Owner') {
            res.status(403).json({ message: 'You do not have permission to perform this operation' });
            return 
        }

        const member = project.members.find((member) => member.user.toString() === memberId);

        if (!member) {
            res.status(404).json({ message: "User is not a member of the project" });
            return 
        }

        project.members = project.members.filter((member) => member.user.toString() !== memberId);

        res.status(200).json({ message: "Member kicked out successfully" });

    }catch (error) {
        console.error(error);
        next(error);
    }
}

// Add member just use for admin
export const addMember = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {projectId, userId, role} = req.body;

        if (!projectId || !userId || !role) {
            res.status(400).json({ message: "Missing required fields" });
            return 
        }

        const project = await Project.findById(projectId);

        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return 
        }

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return 
        }

        const member = project.members.find((member) => member.user.toString() === userId);

        if (member) {
            res.status(400).json({ message: "User is already a member of the project" });
            return 
        }

        project.members.push({ user: userId, role: role });
        user.technicalInfo.pastMatchProjects.push(projectId);

        await project.save();
        res.status(200).json({ message: "Member added successfully" });
    }catch (error) {
        console.error(error);
        next(error);
    }
}

// Set project visivbility
export const setProjectVisibility = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {projectId, visibility, userId } = req.body;

        if (!projectId || !visibility || !userId) {
            res.status(400).json({ message: "Missing required fields" });
            return 
        }

        const project = await Project.findById(projectId);

        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return 
        }

        const { role, error } = await getUserRoleInProject(userId, projectId);
        if (error) {
            res.status(404).json({ message: error });
            return 
        }

        if (role !== 'Owner' && role !== 'Admin') {
            res.status(403).json({ message: 'You do not have permission to perform this operation' });
            return 
        }

        project.visibility = visibility;
    }catch (error) {
        console.error(error);
        next(error);
    }
}
//Search projects
export const searchProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate query parameter
        const query = req.query.query as string;
        if (!query || query.trim().length === 0) {
            res.status(400).json({
                error: "Search query is required",
            });
            return;
        }

        // Sanitize search query
        const sanitizedQuery = query.trim().replace(/[^\w\s]/gi, "");
        if (sanitizedQuery.length < 2) {
            res.status(400).json({
                error: "Search query must be at least 2 characters long",
            });
            return;
        }

        // Validate and parse pagination parameters
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(
            50,
            Math.max(1, parseInt(req.query.limit as string) || 10)
        );
        const skip = (page - 1) * limit;

        console.log("query: ", query);
        const startTime = performance.now();

        // Get total count
        const [countResult] = await Project.aggregate([
            {
                $search: {
                    index: "project_search_index",
                    text: {
                        query: sanitizedQuery,
                        path: ["name", "description", "field"],
                        fuzzy: {
                            maxEdits: 2,
                        },
                    },
                },
            },
            {
                $count: "total",
            },
        ]).catch((err) => {
            throw new Error(`Failed to get count: ${err.message}`);
        });

        // Get paginated results
        const projects = await Project.aggregate([
            {
                $search: {
                    index: "project_search_index",
                    text: {
                        query: sanitizedQuery,
                        path: ["name", "description", "field"],
                        fuzzy: {
                            maxEdits: 2,
                        },
                    },
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]).catch((err) => {
            throw new Error(`Failed to get projects: ${err.message}`);
        });

        const endTime = performance.now();
        const searchTime = endTime - startTime;

        console.log(
            "Search time for query: ",
            query,
            " is ",
            searchTime.toFixed(2),
            "ms"
        );

        // Return response based on whether projects were found
        res.json({
            results: projects || [],
            pagination: {
                total: countResult?.total || 0,
                page,
                limit,
                totalPages: Math.ceil((countResult?.total || 0) / limit),
            },
            message: projects?.length === 0 ? "No projects found matching your search criteria" : undefined
        });
        return;

    } catch (error) {
        console.error("Search error:", error);

        // Check MongoDB Atlas Search index error
        if (error instanceof Error && error.message.includes("index")) {
            res.status(500).json({
                error: "Search index configuration error",
                message: "Please ensure the search index is properly configured",
            });
            return;
        }
        next(error);
    }
};