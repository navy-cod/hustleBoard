import { useState, useEffect } from 'react';
import { useNavigate, Link }    from 'react-router-dom';
import jobsService              from '../services/jobs.service';
import categoriesService        from '../services/categories.service';

const NewJobPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    type: 'full-time',
    category_id: '',
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoriesService.list()
      .then((res) => {
        setCategories(res.data.categories);
        if (res.data.categories.length > 0) {
          setForm((prev) => ({ ...prev, category_id: res.data.categories[0].id.toString() }));
        }
      })
      .catch(() => setError('Failed to load categories. Please refresh.'));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear field error as user types
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    // Simple client side validation
    if (form.title.length < 5) {
      setFieldErrors((prev) => ({ ...prev, title: 'Title must be at least 5 characters long' }));
      setLoading(false);
      return;
    }
    if (form.description.length < 20) {
      setFieldErrors((prev) => ({ ...prev, description: 'Description must be at least 20 characters long' }));
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        category_id: parseInt(form.category_id, 10),
      };
      await jobsService.create(payload);
      navigate('/dashboard/employer');
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorsMap = {};
        err.response.data.errors.forEach(({ field, message }) => {
          errorsMap[field] = message;
        });
        setFieldErrors(errorsMap);
      } else {
        setError(err.response?.data?.message || 'Failed to create job listing.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-sm p-8">
        <div className="mb-6">
          <Link to="/dashboard/employer" className="text-xs font-semibold text-indigo-400 hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white mt-2">Post a New Job</h1>
          <p className="text-sm text-slate-400 mt-1">Reach talented students with details about your listing.</p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-slate-200 block mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Engineering Intern"
              required
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.title ? 'border-red-500' : 'border-slate-700'
              }`}
            />
            {fieldErrors.title && <p className="text-xs text-red-400 mt-1">{fieldErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1">Job Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-slate-700 bg-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="internship">Internship</option>
                <option value="part-time">Part-time</option>
                <option value="freelance">Freelance</option>
                <option value="full-time">Full-time</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full border border-slate-700 bg-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-200 block mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY or Remote"
              required
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.location ? 'border-red-500' : 'border-slate-700'
              }`}
            />
            {fieldErrors.location && <p className="text-xs text-red-400 mt-1">{fieldErrors.location}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-200 block mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the role, responsibilities, and requirements (minimum 20 characters)..."
              rows={6}
              required
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.description ? 'border-red-500' : 'border-slate-700'
              }`}
            />
            {fieldErrors.description && <p className="text-xs text-red-400 mt-1">{fieldErrors.description}</p>}
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <Link
              to="/dashboard/employer"
              className="text-sm text-slate-400 border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg transition-colors font-medium"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewJobPage;
