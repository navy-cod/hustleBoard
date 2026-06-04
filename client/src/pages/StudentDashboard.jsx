import { useState, useEffect } from 'react';
import { Link }                from 'react-router-dom';
import { useAuth }             from '../context/AuthContext';
import applicationsService     from '../services/applications.service';
import StatusBadge             from '../components/StatusBadge';
import LoadingSpinner          from '../components/LoadingSpinner';

const StudentDashboard = () => {
  const { user }  = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  useEffect(() => {
    applicationsService.getMine()
      .then((res) => setApplications(res.data.applications))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  // Derived counts — computed from state, not stored separately
  const counts = {
    total:    applications.length,
    pending:  applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Applications</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back, {user.full_name}</p>
          </div>
          <Link
            to="/jobs"
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Browse jobs
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          {[
            { label: 'Total',    value: counts.total,    colour: 'text-white'  },
            { label: 'Pending',  value: counts.pending,  colour: 'text-yellow-400'},
            { label: 'Accepted', value: counts.accepted, colour: 'text-green-400' },
            { label: 'Rejected', value: counts.rejected, colour: 'text-red-400'   },
          ].map(({ label, value, colour }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${colour}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Applications list */}
        <div className="mt-8">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="text-sm text-red-400 text-center py-12">{error}</p>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl">
              <p className="text-slate-400 text-sm">You have not applied to any jobs yet.</p>
              <Link to="/jobs" className="text-indigo-400 text-sm hover:underline mt-2 inline-block">
                Browse listings →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/jobs/${app.job_id}`}
                        className="font-medium text-white hover:text-indigo-400 transition-colors"
                      >
                        {app.job_title}
                      </Link>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {app.employer_name} · {app.location} · <span className="capitalize">{app.type}</span>
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  {app.cover_note && (
                    <p className="mt-3 text-xs text-slate-500 border-t border-slate-800 pt-3 line-clamp-2">
                      {app.cover_note}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    Applied {new Date(app.applied_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
