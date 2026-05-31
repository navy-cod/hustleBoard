import { useState, useEffect } from 'react';
import { Link }                from 'react-router-dom';
import { useAuth }             from '../context/AuthContext';
import api                     from '../services/api';
import StatusBadge             from '../components/StatusBadge';
import LoadingSpinner          from '../components/LoadingSpinner';

const StudentDashboard = () => {
  const { user }  = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    api.get('/applications/mine')
      .then((res) => setApplications(res.data.applications))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
      <p className="text-gray-500 text-sm mt-1">Welcome, {user.full_name}</p>

      <div className="mt-4">
        <Link
          to="/jobs"
          className="inline-block text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Browse jobs
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <LoadingSpinner />
        ) : applications.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">You have not applied to any jobs yet.</p>
            <Link to="/jobs" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
              Browse listings →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{app.job_title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{app.employer_name} · {app.location}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Applied {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
