
import { CreateUserPayload } from '../../types/user';
import api from '../axios';

export const createUser = async (payload: CreateUserPayload) => {
  const response = await api.post('/users', payload);
  return response.data.user; // extrai apenas o objeto user
};

export const getUsers = () => {
  return api.get('/users');
};
