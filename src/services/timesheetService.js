import api from '../api';

export const getTimesheets = async () => {
  const response = await api.get('/timesheets');
  return response.data;
};