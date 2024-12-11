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
