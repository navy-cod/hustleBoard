import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import jobsService             from '../services/jobs.service';
import { useAuth }             from '../context/AuthContext';
import StatusBadge             from '../components/StatusBadge';
import LoadingSpinner          from '../components/LoadingSpinner';
import api                     from '../services/api';

const JobDetailPage = () => {
  // useParams reads the :id segment from the URL
  const { id }  = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job,     setJob]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Application flow state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    jobsService.getOne(id)
      .then((res) => setJob(res.data.job))
      .catch(() => setError('Job not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyError('');

    try {
      await api.post('/applications', {
        job_id: id,
        cover_note: coverNote,
        resume_url: resumeUrl
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/student');
      }, 1500);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return <p className="text-center text-red-500 py-20">{error}</p>;

  const date = new Date(job.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
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

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
          <span>{job.category_name}</span>
          <span>·</span>
          <span>{job.location}</span>
          <span>·</span>
          <span className="capitalize">{job.type}</span>
          <span>·</span>
          <span>Posted {date}</span>
        </div>

        <hr className="my-6 border-gray-100" />

        {/* Preserve newlines in the description */}
        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {job.description}
        </div>

        <div className="mt-8">
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-medium">
              ✓ Application submitted successfully! Redirecting to dashboard...
            </div>
          ) : showApplyForm ? (
            <form onSubmit={handleApply} className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
              <h3 className="text-md font-bold text-gray-900">Apply for this Job</h3>
              {applyError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                  {applyError}
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Cover Note (Optional)</label>
                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Explain why you're a good fit for this role..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Resume URL (Optional)</label>
                <input
                  type="text"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="e.g. Link to Google Drive, Dropbox, or Portfolio"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyForm(false);
                    setApplyError('');
                  }}
                  className="text-xs text-gray-600 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60 px-4 py-1.5 rounded-lg transition-colors font-semibold"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          ) : !isAuthenticated ? (
            <Link
              to="/login"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Sign in to apply
            </Link>
          ) : user.role === 'student' && job.status === 'open' ? (
            <button
              onClick={() => setShowApplyForm(true)}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Apply Now
            </button>
          ) : user.role === 'employer' ? (
            <p className="text-sm text-gray-400">Employers cannot apply to listings.</p>
          ) : (
            <p className="text-sm text-gray-400">This listing is currently closed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
