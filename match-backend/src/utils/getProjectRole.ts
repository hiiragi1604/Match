import Project from '../models/Project';

export const getUserRoleInProject = async (userId: string, projectId: string) => {
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return { error: 'Project not found' };
        }
        const member = project.members.find((member) => member.user.toString() === userId);
        if (!member) {
            return { error: 'User not a member of the project' };
        }
        return { role: member.role };
    } catch (error) {
        return { error: `Error getting project role: ${(error as Error).message}` };
    }
};

