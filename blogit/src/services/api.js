import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // Ensure this matches your backend base URL
});

// Interceptor for adding the authorization token to each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export const blockUser = (userSlug) => API.patch(`/admin/block/${userSlug}`);
export const unblockUser = (userSlug) => API.patch(`/admin/unblock/${userSlug}`);
export const deleteBlog = (blogSlug) => API.delete(`/admin/blog/${blogSlug}`);
export const deleteComment = (commentSlug) => API.delete(`/admin/comment/${commentSlug}`);
export const promoteUser = (email) => API.post('/admin/promote-to-admin', { email });