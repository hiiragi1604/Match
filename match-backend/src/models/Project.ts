import mongoose, { Schema, Document } from 'mongoose';

interface IProjectMember {
    user: mongoose.Types.ObjectId;
    role: string;
}

// Define the Project interface
interface IProject extends Document {
    name: string;
    description: string;
    members: IProjectMember[];
    desiredSkills: string[];
    languages: string[];
    field: string;
    location?: string; // Optional
    applicants: mongoose.Types.ObjectId[];
    visibility: string
}

const projectMemberSchema = new Schema<IProjectMember>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true }
});

// Create the Project Schema
const projectSchema = new Schema<IProject>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: { type: [projectMemberSchema], default: [] },
    desiredSkills: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    field: { type: String, required: true },
    location: { type: String, default: null }, // Optional
    applicants: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }, // Optional
    visibility: { type: String, required: true }
});

// Create the Project Model
const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
