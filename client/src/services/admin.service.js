import api from './api';

const adminService = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    getUserStatus: (id, isActive) => api.patch(`/admin/users/${id}/status`, {is_active: isActive}),
    getJobs: () => api.get('/admin/jobs'),
    deleteJobs: (id) => api.delete(`/admin/jobs/${id}`),
};

export default adminService;