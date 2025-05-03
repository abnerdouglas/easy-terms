
import { CreateUserPayload, UpdateUserPayload } from '../../types/user';
import api from '../axios';

export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post('/users', payload);
  return response.data.user; // extrai apenas o objeto user
};

export const getUsers = () => {
  return api.get('/users');
};

export const deleteUser = (id: string) => {
  return api.delete(`/users/${id}`);
};

export const updateUser = (id: string, data: UpdateUserPayload) => {
  console.log('updateUser', data);
  return api.put(`/users/${id}`, data);
};
