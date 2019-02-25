import axios from "axios";

export const write = content => axios.post("/api/posts", { content });


/* 
export const list = () => axios.get("/api/posts");
export const listOfUser = username =>
  axios.get(`/api/posts?username=${username}`);
*/
// 액션을 재사용하지 못해 하나로 합친다. 
export const list = (username) => axios.get('/api/posts'+(username ? `?username=${username}`: ''));
export const next = url => axios.get(url);

export const like = postId => axios.post(`/api/posts/${postId}/likes`);
export const unlike = postId => axios.delete(`/api/posts/${postId}/likes`);

export const comment = ({ postId, text }) => axios.post(`/api/posts/${postId}/comments`, {text});
