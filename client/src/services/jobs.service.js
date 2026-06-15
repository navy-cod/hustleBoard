import api from "./api";

const jobsService = {
    list: (params) => api.get('/jobs', { params }),
    getOne: (id) => api.get(`/jobs/${id}`),
    mine: () => api.get('/jobs/mine'),
    create: (data) => api.post('/jobs', data),
    update: (id, data) => api.patch(`/jobs/${id}`, data),
    remove: (id) => api.delete(`/jobs/${id}`),
};

export default jobsService;
