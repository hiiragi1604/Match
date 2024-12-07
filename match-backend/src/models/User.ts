import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface
interface IUser extends Document {
    personalInfo: {
        name: string;
        dob: Date;
        university: string;
        username: string;
        email: string;
        password: string;  //should be hashed
    };
    technicalInfo: {
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
        pastMatchProjects: mongoose.Schema.Types.ObjectId[];
    };
    projectsOwned: mongoose.Schema.Types.ObjectId[];
}

// Create the User Schema
const userSchema = new Schema<IUser>({
    personalInfo: {
        name: { type: String, required: true },
        dob: { type: Date, required: true },
        university: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    technicalInfo: {
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
        ],
        pastMatchProjects: { type: [mongoose.Schema.Types.ObjectId], ref: 'Project', default: [] }
    },
    projectsOwned: { type: [mongoose.Schema.Types.ObjectId], ref: 'Project', default: [] }
});

// Create the User Model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
