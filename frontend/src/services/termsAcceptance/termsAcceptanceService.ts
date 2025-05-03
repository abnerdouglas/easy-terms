import api from '../axios';

export const getTermsAcceptanced = () => api.get('/user-term-acceptance');