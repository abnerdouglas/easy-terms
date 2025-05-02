import api from '../axios';

export const getTermsAcceptanced = () => api.get('/termsAcceptance/history');