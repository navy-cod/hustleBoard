import { useState, useEffect } from 'react';
import { useParams, Link }     from 'react-router-dom';
import jobsService             from '../services/jobs.service';
import applicationsService     from '../services/applications.service';
import { useAuth }             from '../context/AuthContext';
import StatusBadge             from '../components/StatusBadge';
import LoadingSpinner          from '../components/LoadingSpinner';


const ApplyModal = ({ job, onClose, onSuccess }) => {
  const [coverNote, setCoverNote] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await applicationsService.apply({ job_id: job.id, cover_note: coverNote });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop — clicking outside the modal closes it
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}  // prevent backdrop click from firing
      >
        <h2 className="text-lg font-bold text-gray-900">Apply — {job.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{job.employer_name}</p>

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Cover note <span className="text-gray-400 font-normal">(optional, max 1000 characters)</span>
            </label>
            <textarea
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="Briefly introduce yourself and explain why you're a good fit…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {coverNote.length}/1000
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-lg hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              {loading ? 'Submitting…' : 'Submit application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main page 

const JobDetailPage = () => {
  const { id }  = useParams();
  const { user, isAuthenticated } = useAuth();

  const [job,       setJob]       = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [applied,   setApplied]   = useState(false);

  useEffect(() => {
    jobsService.getOne(id)
      .then((res) => setJob(res.data.job))
      .catch(() => setError('Job not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSuccess = () => {
    setShowModal(false);
    setApplied(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return <p className="text-center text-red-500 py-20">{error}</p>;

  const date = new Date(job.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      {showModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/jobs" className="text-sm text-indigo-600 hover:underline">← Back to jobs</Link>

        <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-gray-500 mt-1">{job.employer_name}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>

          <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-500">
            <span>{job.category_name}</span>
            <span>·</span>
            <span>{job.location}</span>
            <span>·</span>
            <span className="capitalize">{job.type}</span>
            <span>·</span>
            <span>Posted {date}</span>
          </div>

          <hr className="my-6 border-gray-100" />

          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>

          <div className="mt-8">
            {applied ? (
              <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-2.5 rounded-lg text-sm">
                ✓ Application submitted — check your dashboard for updates
              </div>
            ) : !isAuthenticated ? (
              <Link
                to="/login"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                Sign in to apply
              </Link>
            ) : user.role === 'student' && job.status === 'open' ? (
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                Apply for this role
              </button>
            ) : user.role === 'employer' ? (
              <p className="text-sm text-gray-400">Employers cannot apply to listings.</p>
            ) : (
              <p className="text-sm text-gray-400">This listing is currently closed.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetailPage;
