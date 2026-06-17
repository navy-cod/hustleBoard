const adminService = require('../services/admin.service');

const getUsers = async (req, res) => {
    try {
        const users = await adminService.listUsers();
        res.status(200).json({ users });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const user = await adminService.setUserStatus({
            userId: req.params.id,
            isActive: req.body.is_active,
            requestingAdminId: req.user.id,
        });
        res.status(200).json({ user });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await adminService.listAllJobs();
        res.status(200).json({ jobs });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        await adminService.deleteJobAsAdmin(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

const getStats = async (req, res) => {
    try {
        const stats = await adminService.getStats();
        res.status(200).json({ stats });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

module.exports = { getUsers, updateUserStatus, getJobs, deleteJob, getStats };
