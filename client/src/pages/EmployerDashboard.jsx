import { useState, useEffect, useCallback } from 'react';
import { useAuth }             from '../context/AuthContext';
import jobsService             from '../services/jobs.service';
import applicationsService     from '../services/applications.service';
import StatusBadge             from '../components/StatusBadge';
import LoadingSpinner          from '../components/LoadingSpinner';

const EmployerDashboard = () => {
  const { user }   = useAuth();
  const [jobs,     setJobs]     = useState([]);
  const [loading,  setLoading]  = useState(true);

  // selectedJobId drives the applicant panel — null means no job selected
  const [selectedJobId,   setSelectedJobId]   = useState(null);
  const [applications,    setApplications]    = useState([]);
  const [appsLoading,     setAppsLoading]     = useState(false);

  const fetchMyJobs = useCallback(async () => {
    try {
      const res = await jobsService.list({ limit: 50 });
      // Use the proper server-filtered endpoint response
      setJobs(res.data.jobs);
    } catch {
      // silently fail 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
   // eslint-disable-next-line
    fetchMyJobs();
  }, [fetchMyJobs]);

  // When an employer clicks a listing, load its applicants
  const handleSelectJob = async (jobId) => {
    if (selectedJobId === jobId) {
      setSelectedJobId(null);  // toggle off
      setApplications([]);
      return;
    }
    setSelectedJobId(jobId);
    setAppsLoading(true);
    try {
      const res = await applicationsService.getForJob(jobId);
      setApplications(res.data.applications);
    } catch {
      setApplications([]);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await applicationsService.updateStatus(appId, status);
      // Update the local state immediately — no need to refetch
      setApplications((prev) =>
        prev.map((a) => a.id === appId ? { ...a, status } : a)
      );
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleCloseJob = async (jobId) => {
    try {
      await jobsService.update(jobId, { status: 'closed' });
      setJobs((prev) =>
        prev.map((j) => j.id === jobId ? { ...j, status: 'closed' } : j)
      );
    } catch {
      alert('Failed to close listing.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Employer Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome, {user.full_name}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left panel — job listings */}
          <div>
            <h2 className="text-sm font-semibold text-slate-200 mb-3">
              My listings <span className="text-slate-500 font-normal">({jobs.length})</span>
            </h2>

            {loading ? (
              <LoadingSpinner />
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <p className="text-slate-400 text-sm">No listings yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => handleSelectJob(job.id)}
                    className={`w-full text-left bg-slate-900 border rounded-xl p-4 transition-all ${
                      selectedJobId === job.id
                        ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate text-sm">{job.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {job.category_name} · <span className="capitalize">{job.type}</span>
                        </p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-indigo-400">
                        {selectedJobId === job.id ? 'Hide applicants ▲' : 'View applicants ▼'}
                      </p>
                      {job.status === 'open' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCloseJob(job.id); }}
                          className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                        >
                          Close listing
                        </button>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right panel — applicants for selected job */}
          <div>
            <h2 className="text-sm font-semibold text-slate-200 mb-3">
              {selectedJobId
                ? `Applicants (${applications.length})`
                : 'Select a listing to see applicants'}
            </h2>

            {!selectedJobId ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <p className="text-slate-400 text-sm">Click a listing on the left.</p>
              </div>
            ) : appsLoading ? (
              <LoadingSpinner />
            ) : applications.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <p className="text-slate-400 text-sm">No applications yet for this listing.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {applications.map((app) => (
                  <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white text-sm">{app.student_name}</p>
                        <p className="text-xs text-slate-500">{app.student_email}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    {app.cover_note && (
                      <p className="mt-2 text-xs text-slate-400 border-t border-slate-800 pt-2 line-clamp-3">
                        {app.cover_note}
                      </p>
                    )}

                    {/* Action buttons — only shown if still pending */}
                    {app.status === 'pending' && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleStatusChange(app.id, 'reviewed')}
                          className="text-xs px-3 py-1.5 border border-blue-800 text-blue-300 rounded-lg hover:bg-blue-900/30 transition-colors"
                        >
                          Mark reviewed
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, 'accepted')}
                          className="text-xs px-3 py-1.5 border border-green-800 text-green-300 rounded-lg hover:bg-green-900/30 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, 'rejected')}
                          className="text-xs px-3 py-1.5 border border-red-800 text-red-300 rounded-lg hover:bg-red-900/30 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {app.status === 'reviewed' && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleStatusChange(app.id, 'accepted')}
                          className="text-xs px-3 py-1.5 border border-green-800 text-green-300 rounded-lg hover:bg-green-900/30 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, 'rejected')}
                          className="text-xs px-3 py-1.5 border border-red-800 text-red-300 rounded-lg hover:bg-red-900/30 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
