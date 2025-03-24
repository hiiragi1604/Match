import { useEffect, useState } from "react";
import { getRecommendedProjects } from "../../api/recommender";
import { useIsOwner } from "../../context/IsOwnerContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserFromFirebaseUid } from "../../api/user";
import TinderCard from "react-tinder-card";
import styles from "./Match.module.scss"; // Import the CSS module
import { getProjectById } from "../../api/project";
import abstractBackground from "../../assets/abstract-background-black-white-texture-grainy_474888-5433.avif";
import { recordSwipping } from "../../api/swipe";

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

      try {
        const mongoUser = await getUserFromFirebaseUid(user.uid);
        console.log("Mongo user:", mongoUser);

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
      } catch (error) {
        console.error("Error fetching recommended projects:", error);
      }
    };

    fetchRecommendedProjects();
  }, [isOwner, user, loading, navigate]);

  console.log("Recommended projects:", recommendedProjects);

<<<<<<< HEAD
  const swiped = (direction: string, projectId: string) => {
    console.log(`You swiped: ${direction} on ${projectId}`);

    // Remove the swiped project from the list
    setRecommendedProjects((prevProjects) =>
      prevProjects.filter((project) => project._id !== projectId)
    );
=======
  const swiped = async (direction: string, projectId: string) => {
    if (!user) {
      navigate("/signin");
      return;
    }
    //This still take ID from firebase, need to change to mongoDB ID
    const mongoUser = await getUserFromFirebaseUid(user.uid);
    recordSwipping(mongoUser._id, projectId, direction, new Date());
    console.log("You swiped: " + direction + " on " + projectId);
>>>>>>> main
  };

  const outOfFrame = (projectName: string) => {
    console.log(`${projectName} left the screen`);
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while waiting for the auth state
  }

  return (
    <div className={styles.container}>
      <h1>Match</h1>
      <div className={styles.background}></div>
      <div className={styles.tinderCardsContainer}>
        <img
          src={abstractBackground}
          alt="abstract background"
          className={styles.backgroundImage}
        />
      <div className={styles.blackRectangle}></div>

        {recommendedProjects.length === 0 ? (
          <p>No projects available</p>
        ) : (
          recommendedProjects.map((project) => (
            <TinderCard
              className={styles.swipe}
              key={project._id}
              onSwipe={(dir) => swiped(dir, project._id)}
              onCardLeftScreen={() => outOfFrame(project.name)}
              preventSwipe={["up", "down"]}
            >
              <div className={styles.card}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p>Skills: {project.desiredSkills.join(", ")}</p>
                <p>Languages: {project.languages.join(", ")}</p>
                <p>Field: {project.field}</p>
              </div>
            </TinderCard>
          ))
        )}
      </div>
    </div>
  );
};
