import api from '../axios';

export const getUserHistoryLogs = () => {
    return api.get('/history?entity=User');
  };
  
  export const getTermHistoryLogs = () => {
    return api.get('/history?entity=Term');
  };
