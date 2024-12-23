import { Request, Response, NextFunction } from "express";
import Project from "../models/Project";
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
        const project = await Project.create(req.body);
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
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.status(200).json(project);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ message: "Invalid project data" });
            return;
        }
        next(error);
    }
};

// Delete a project by ID
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        next(error);
    }
};

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