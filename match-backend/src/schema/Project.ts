import mongoose, { Schema, Document } from 'mongoose';

// Define the Project interface
interface IProject extends Document {
    name: string;
    description: string;
    owner: mongoose.Types.ObjectId; // Reference to a User/Student
    desiredSkills: string[];
    languages: string[];
    field: string;
    location?: string; // Optional
}

// Create the Project Schema
const projectSchema = new Schema<IProject>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Student', required: true }, // Reference to the Student model
    desiredSkills: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    field: { type: String, required: true },
    location: { type: String, default: null } // Optional
});

// Create the Project Model
const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
