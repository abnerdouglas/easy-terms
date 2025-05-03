import { CreateTermPayload } from '../../types/term';
import api from '../axios';

export const getTerms = () => api.get('/terms');

export const createTerm = (data: CreateTermPayload) => api.post('/terms', data);
