import { useState, useEffect } from 'react';
import { useAuth }    from '../context/AuthContext';
import adminService   from '../services/admin.service';
import StatusBadge    from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats,   setStats]   = useState(null);
  const [users,   setUsers]   = useState([]);
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState({ stats: true, users: true, jobs: true });
  const [error,   setError]   = useState({ stats: '', users: '', jobs: '' });

  useEffect(() => {
    adminService.getStats()
      .then((res) => setStats(res.data.stats))
      .catch(() => setError((e) => ({ ...e, stats: 'Failed to load stats' })))
      .finally(() => setLoading((l) => ({ ...l, stats: false })));
  }, []);

  const fetchUsers = () => {
    setLoading((l) => ({ ...l, users: true }));
    adminService.getUsers()
      .then((res) => setUsers(res.data.users))
      .catch(() => setError((e) => ({ ...e, users: 'Failed to load users' })))
      .finally(() => setLoading((l) => ({ ...l, users: false })));
  };

  const fetchJobs = () => {
    setLoading((l) => ({ ...l, jobs: true }));
    adminService.getJobs()
      .then((res) => setJobs(res.data.jobs))
      .catch(() => setError((e) => ({ ...e, jobs: 'Failed to load jobs' })))
      .finally(() => setLoading((l) => ({ ...l, jobs: false })));
  };

  useEffect(() => { fetchUsers(); fetchJobs(); }, []);

  const handleToggleUser = async (targetUser) => {
    const action = targetUser.is_active ? 'suspend' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${action} ${targetUser.full_name}?`)) return;

    try {
      await adminService.setUserStatus(targetUser.id, !targetUser.is_active);
      setUsers((prev) =>
        prev.map((u) => u.id === targetUser.id ? { ...u, is_active: !u.is_active } : u)
      );
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} user`);
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Permanently delete "${job.title}"? This cannot be undone.`)) return;

    try {
      await adminService.deleteJob(job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-slate-400 text-sm mt-1">Signed in as {user.full_name}</p>

        {/* Stats section */}
        <section className="mt-8">
          {loading.stats ? (
            <LoadingSpinner message="Loading stats…" />
          ) : error.stats ? (
            <p className="text-sm text-red-500">{error.stats}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total users',        value: stats.total_users },
                { label: 'Total jobs',          value: stats.total_jobs },
                { label: 'Open jobs',           value: stats.open_jobs },
                { label: 'Total applications',  value: stats.total_applications },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User management section */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">
            User management <span className="text-slate-500 font-normal">({users.length})</span>
          </h2>

          {loading.users ? (
            <LoadingSpinner message="Loading users…" />
          ) : error.users ? (
            <p className="text-sm text-red-500">{error.users}</p>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 text-slate-400 text-xs">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium">Name</th>
                    <th className="text-left px-4 py-2.5 font-medium">Email</th>
                    <th className="text-left px-4 py-2.5 font-medium">Role</th>
                    <th className="text-left px-4 py-2.5 font-medium">Status</th>
                    <th className="text-right px-4 py-2.5 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-2.5 text-white">{u.full_name}</td>
                      <td className="px-4 py-2.5 text-slate-400">{u.email}</td>
                      <td className="px-4 py-2.5 text-slate-400 capitalize">{u.role}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={u.is_active ? 'open' : 'closed'} />
                        <span className="ml-1.5 text-xs text-slate-500">{u.is_active ? 'active' : 'suspended'}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {/* Admins cannot suspend other admins or themselves via this UI */}
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUser(u)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                              u.is_active
                                ? 'border-red-800 text-red-300 hover:bg-red-900/30'
                                : 'border-green-800 text-green-300 hover:bg-green-900/30'
                            }`}
                          >
                            {u.is_active ? 'Suspend' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Job moderation section */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">
            Job moderation <span className="text-slate-500 font-normal">({jobs.length})</span>
          </h2>

          {loading.jobs ? (
            <LoadingSpinner message="Loading jobs…" />
          ) : error.jobs ? (
            <p className="text-sm text-red-500">{error.jobs}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {jobs.map((job) => (
                <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">{job.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {job.employer_name} ({job.employer_email}) · {job.category_name}
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
                  <button
                    onClick={() => handleDeleteJob(job)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-800 text-red-300 hover:bg-red-900/30 transition-colors shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;