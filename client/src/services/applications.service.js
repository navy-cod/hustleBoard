import api from './api';

const applicationsService = {
    apply: (data) => api.post('/applications', data),
    getMine: () => api.get('/applications/mine'),
    getForJob: (jobId) => api.get(`/applications/job/${jobId}`),
    updateStatus: ( id, status ) => api.patch(`/applications/${id}/status`, { status }),
};

export default applicationsService;