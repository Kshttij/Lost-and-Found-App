import axiosInstance from "./axiosConfig";

export const getAllItems = () => axiosInstance.get("/items");
export const getItemById = (id) => axiosInstance.get(`/items/${id}`);
export const createItem = (itemData) => axiosInstance.post("/items", itemData);
export const updateItem = (id, updatedItem) => axiosInstance.put(`/items/${id}`, updatedItem);
export const deleteItem = (id) => axiosInstance.delete(`/items/${id}`);
