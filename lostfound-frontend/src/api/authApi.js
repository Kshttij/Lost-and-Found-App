import axiosInstance from "./axiosConfig";

export const registerUser = (userData) =>
  axiosInstance.post("/users/register", userData);

export const loginUser = (credentials) =>
  axiosInstance.post("/auth/login", credentials);
