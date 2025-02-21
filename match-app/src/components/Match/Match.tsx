import { useEffect, useState } from "react";
import { getRecommendedProjects } from "../../api/recommender";
import { useIsOwner } from "../../context/IsOwnerContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserFromFirebaseUid } from "../../api/user";
import TinderCard from "react-tinder-card";
import styles from "./Match.module.css"; // Import the CSS module
import { getProjectById } from "../../api/project";

export const Match = () => {
  const { isOwner } = useIsOwner();
  const { user, loading } = useAuth();
  const [recommendedProjects, setRecommendedProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedProjects = async () => {
      if (loading) return;

      if (!user) {
        navigate("/signin");
        return;
      }
      const mongoUser = await getUserFromFirebaseUid(user.uid);
      console.log("Mongo user: ", mongoUser);
      if (!mongoUser) {
        navigate("/signin");
        return;
      }
      const projects = await getRecommendedProjects(mongoUser._id);
      const projectsData = await Promise.all(
        projects.map(async (project: any) => {
          const projectData = await getProjectById(project.projectId);
          return projectData;
        })
      );
      setRecommendedProjects(projectsData);
    };
    fetchRecommendedProjects();
  }, [isOwner, user, loading]);

  console.log("Recommended projects: ", recommendedProjects);

  const swiped = (direction: string, projectName: string) => {
    console.log("You swiped: " + direction + " on " + projectName);
  };

  const outOfFrame = (projectName: string) => {
    console.log(projectName + " left the screen");
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while waiting for the auth state
  }

  return (
    <div className={styles.container}>
      <div>
        <h1>Match</h1>
        <div className={styles.tinderCardsContainer}>
          {recommendedProjects.map((project) => (
            <TinderCard
              className={styles.swipe}
              key={project._id}
              onSwipe={(dir) => swiped(dir, project.name)}
              onCardLeftScreen={() => outOfFrame(project.name)}
            >
              <div className={styles.card}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p>Skills: {project.desiredSkills.join(", ")}</p>
                <p>Languages: {project.languages.join(", ")}</p>
                <p>Field: {project.field}</p>
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
    </div>
  );
};
