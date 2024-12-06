import mongoose, { Schema, Document } from 'mongoose';

// Define the Student interface
interface IStudent extends Document {
    personalInfo: {
        name: string;
        dob: Date;
        university: string;
        username: string;
        email: string;
        password: string;  //should be hashed
    };
    functionalInfo: {
        skills: string[];
        degree: string;
        languages: string[];
        skillsToLearn: string[];
        pastProjects: {
            title: string;
            description: string;
            techUsed: string[];
            link?: string; // Optional
        }[];
    };
}

// Create the Student Schema
const studentSchema = new Schema<IStudent>({
    personalInfo: {
        name: { type: String, required: true },
        dob: { type: Date, required: true },
        university: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    functionalInfo: {
        skills: { type: [String], default: [] },
        degree: { type: String, required: true },
        languages: { type: [String], default: [] },
        skillsToLearn: { type: [String], default: [] },
        pastProjects: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
                techUsed: { type: [String], default: [] },
                link: { type: String }
            }
        ]
    }
});

// Create the Student Model
const Student = mongoose.model<IStudent>('Student', studentSchema);

export default Student;
