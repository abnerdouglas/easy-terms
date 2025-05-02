import api from '../axios';

interface LoginPayload {
  email: string;
  password: string;
}

export const login = (data: LoginPayload) => {
  return api.post('/auth/login', data);
};
