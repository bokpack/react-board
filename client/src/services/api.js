import Axios from "axios";

const API_URL = "http://localhost:8000/api";

// 게시판
export const fetchBoardList = () => Axios.get(`${API_URL}/get` , {withCredentials : true});
export const createBoard = (data) => Axios.post(`${API_URL}/insert`,data , {withCredentials : true});
export const deleteBoard = (id) => Axios.delete(`${API_URL}/delete/${id}` , {withCredentials : true});
export const updateBoard = (id, data) => Axios.put(`${API_URL}/update/${id}`, data , {withCredentials : true});
export const fetchBoardDetail = (id) => Axios.get(`${API_URL}/detail/${id}`, { withCredentials: true });


// 로그인
export const loginUser = (data) => Axios.post(`${API_URL}/login`, data , {withCredentials : true});
//로그아웃
export const logoutUser = () => Axios.post(`${API_URL}/logout`, {} , {withCredentials : true})
//세션 유지
export const checkSession = () => Axios.get(`${API_URL}/session`, {withCredentials : true})

// 댓글
export const fetchComments = (postId) => Axios.get(`${API_URL}/comments/${postId}`, {withCredentials : true});
export const addComment = (postId, data) => Axios.post(`${API_URL}/comment/${postId}`, data,{withCredentials : true})
export const updateComment = (commentId,data) => Axios.put(`${API_URL}/comment/${commentId}`, data,{withCredentials : true})