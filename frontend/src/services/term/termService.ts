import api from '../axios';

export const getTerms = () => api.get('/terms');

export const createTerm = (data: {
  title: string;
  content: string;
  version: string;
  isActive?: boolean;
}) => api.post('/terms', data);
