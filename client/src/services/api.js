import Axios from "axios";

const API_URL = "http://localhost:8000/api";

export const fetchBoardList = () => Axios.get(`${API_URL}/get`);

export const createBoard = (data) => Axios.post(`${API_URL}/insert`,data);

export const deleteBoard = (id) => Axios.delete(`${API_URL}/delete/${id}`);

export const updateBoard = (id, data) => Axios.put(`${API_URL}/update/${id}`, data);