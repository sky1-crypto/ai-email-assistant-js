import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const generateEmail = async (emailData) => {
  const response = await API.post(
    "/email/generate",
    emailData
  );

  return response.data.email;
};

export const reviseEmail = async (revisionData) => {
  const response = await API.post(
    "/email/revise",
    revisionData
  );

  return response.data.email;
};