import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:44305/api', // Update with your API base URL
});

export default api;