import Axios from "axios";

const API_URL = "http://localhost:8000/api";

// 게시판
export const fetchBoardList = () => Axios.get(`${API_URL}/get` , {withCredentials : true});
export const createBoard = (data) => Axios.post(`${API_URL}/insert`,data , {withCredentials : true});
export const deleteBoard = (id) => Axios.delete(`${API_URL}/delete/${id}` , {withCredentials : true});
export const updateBoard = (id, data) => Axios.put(`${API_URL}/update/${id}`, data , {withCredentials : true});

// 로그인
export const loginUser = (data) => Axios.post(`${API_URL}/login`, data , {withCredentials : true});
//로그아웃
export const logoutUser = () => Axios.post(`${API_URL}/logout`, {} , {withCredentials : true})
//세션 유지
export const checkSession = () => Axios.get(`${API_URL}/session`, {withCredentials : true})