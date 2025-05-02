import api from '../axios';

export const createUser = (data: any) => {
  return api.post('/users', data);
};

export const getUsers = () => {
  return api.get('/users');
};
