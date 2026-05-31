import { useState, useEffect } from 'react';
import { Link }                from 'react-router-dom';
import { useAuth }             from '../context/AuthContext';
import jobsService             from '../services/jobs.service';
import StatusBadge             from '../components/StatusBadge';
import LoadingSpinner          from '../components/LoadingSpinner';

const EmployerDashboard = () => {
  const { user }  = useAuth();
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = () => {
    jobsService.list({ limit: 50 })
      .then((res) => {
        setJobs(res.data.jobs.filter((j) => j.employer_id === user.id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMyJobs(); }, []);

  const handleClose = async (id) => {
    try {
      await jobsService.update(id, { status: 'closed' });
      fetchMyJobs();
    } catch {
      alert('Failed to close listing.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome, {user.full_name}</p>
        </div>
        <Link
          to="/jobs/new"
          className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Post a job
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <LoadingSpinner />
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">You have not posted any listings yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{job.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{job.category_name} · {job.location}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={job.status} />
                  {job.status === 'open' && (
                    <button
                      onClick={() => handleClose(job.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
