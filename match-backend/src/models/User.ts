import mongoose, { Schema, Document } from 'mongoose';

// Define the AppliedProject interface and schema first
interface IAppliedProject {
    projectId: mongoose.Types.ObjectId;
    status: string;
}

// Create the AppliedProject Schema
const appliedProjectSchema = new Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    status: { type: String, required: true }
});

// Define the User interface
interface IUser extends Document {
    firebaseUid: string;
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
        pastMatchProjects: mongoose.Types.ObjectId[];
    };
    projectsOwned: mongoose.Types.ObjectId[];
    appliedProjects: IAppliedProject[];
}

// Create the User Schema
const userSchema = new Schema<IUser>({
    firebaseUid: { type: String, required: false, unique: true }, //Set to false because we are not creating a user in Firebase when we create a user in MongoDB (Testing purposes)
    personalInfo: {
        name: { type: String, required: false, default: "" },
        dob: { type: Date, required: false, default: new Date() },
        university: { type: String, required: false, default: "" },
    },
    technicalInfo: {
        skills: { type: [String], default: [] },
        degree: { type: String, required: false, default: "" },
        languages: { type: [String], default: [] },
        skillsToLearn: { type: [String], default: [] },
        pastProjects: { type: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
                techUsed: { type: [String], default: [] },
                link: { type: String }
            }
        ], default: [] },
        pastMatchProjects: { type: [mongoose.Schema.Types.ObjectId], ref: 'Project', default: [] }
    },
    projectsOwned: { type: [mongoose.Schema.Types.ObjectId], ref: 'Project', default: [] },
    appliedProjects: { type: [appliedProjectSchema], default: [] }
});

// Create the User Model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
