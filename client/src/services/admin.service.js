import api from './api';

const adminService = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    setUserStatus: (id, isActive) => api.patch(`/admin/users/${id}/status`, {is_active: isActive}),
    getJobs: () => api.get('/admin/jobs'),
    deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
};

export default adminService;