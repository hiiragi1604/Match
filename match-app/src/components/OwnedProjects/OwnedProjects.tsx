import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "./OwnedProject.module.css";

export const OwnedProjects = () => {
  const baseUri = import.meta.env.VITE_MATCH_API_URI;
  const [projects, setProjects] = useState<any[]>([]);
  const uid = localStorage.getItem("uid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${baseUri}/users/projects/${uid}`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [uid]);
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  return (
    <div>
      <ul>
        {projects.map((project) => (
          <div
            onClick={() => handleProjectClick(project._id)}
            className={styled.project}
          >
            <li key={project._id}>
              <h2>{project.name}</h2>
              <p>Description: {project.description}</p>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};
