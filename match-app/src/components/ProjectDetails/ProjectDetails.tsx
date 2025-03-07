import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [project, setProject] = useState<any>({});
  const baseUri = import.meta.env.VITE_MATCH_API_URI;
  const uid = localStorage.getItem("uid");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${baseUri}/projects/getById/${projectId}`
        );
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `${baseUri}/projects/applicants/${projectId}`
        );
        const userIds = response.data;
        console.log(`data: ${userIds}`);

        const userDetails = await Promise.all(
          userIds.map(async (userId: string) => {
            const userResponse = await axios.get(`${baseUri}/users/${userId}`);
            return userResponse.data;
          })
        );

        console.log("User Details:", userDetails);
        setApplicants(userDetails);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [projectId]);

  const handleApplicantClick = (applicantId: string) => {
    navigate(`/users/${applicantId}`);
  };

  const accept = async (applicantId: string) => {
    try {
      const response = await axios.put(
        `${baseUri}/projects/updateApplication`,
        {
          ownerId: uid,
          userId: applicantId,
          projectId: projectId,
          status: "Approved",
        }
      );
      console.log(response.data);
      setApplicants((prev) =>
        prev.filter((applicant) => applicant._id !== applicantId)
      );
    } catch (error) {
      console.error("Error accepting applicant:", error);
    }
  };

  const reject = async (applicantId: string) => {
    try {
      const response = await axios.put(
        `${baseUri}/projects/updateApplication`,
        {
          ownerId: uid,
          userId: applicantId,
          projectId: projectId,
          status: "Rejected",
        }
      );
      console.log(response.data);
      setApplicants((prev) =>
        prev.filter((applicant) => applicant._id !== applicantId)
      );
    } catch (error) {
      console.error("Error rejecting applicant:", error);
    }
  };
  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <h2>Applicants</h2>
      <ul>
        {applicants.map((applicant) => (
          <li key={applicant._id}>
            <h3 onClick={() => handleApplicantClick(applicant._id)}>
              {applicant.personalInfo.name}
            </h3>
            <div>
              <button onClick={() => accept(applicant._id)}>Accept</button>
              <button onClick={() => reject(applicant._id)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
