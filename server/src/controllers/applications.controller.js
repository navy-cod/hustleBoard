
const applicationsService = require('../services/applications.service');

const apply = async (req, res) => {
  try {
    const application = await applicationsService.applyToJob({
      studentId: req.user.id,
      jobId:     req.body.job_id,
      coverNote: req.body.cover_note,
    });
    return res.status(201).json({ application });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await applicationsService.getMyApplications(req.user.id);
    return res.status(200).json({ applications });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const applications = await applicationsService.getJobApplications({
      jobId:      req.params.jobId,
      employerId: req.user.id,
    });
    return res.status(200).json({ applications });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const application = await applicationsService.updateApplicationStatus({
      applicationId: req.params.id,
      employerId:    req.user.id,
      status:        req.body.status,
    });
    return res.status(200).json({ application });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { apply, getMyApplications, getJobApplications, updateStatus };
