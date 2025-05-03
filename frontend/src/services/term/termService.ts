import { CreateTermPayload, UpdateTermPayload } from '../../types/term';
import api from '../axios';

export const getTerms = () => api.get('/terms');

export const createTerm = (data: CreateTermPayload) => api.post('/terms', data);

export const updateTerm = (id: string, data: UpdateTermPayload) => api.put(`/terms/${id}`, data);

export const deleteTerm = (id: string) => api.delete(`/terms/${id}`);
  