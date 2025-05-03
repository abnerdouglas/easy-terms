
import { CreateUserPayload } from '../../types/user';
import api from '../axios';

export const createUser = (data: CreateUserPayload) => {
  return api.post('/users', data);
};

export const getUsers = () => {
  return api.get('/users');
};
