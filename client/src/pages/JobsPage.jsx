import { useState, useEffect } from 'react';
import { mergeSort, byDateDesc, byDateAsc, byTitleAsc, byTitleDesc, byType } from '../lib/mergeSort';
import jobsService        from '../services/jobs.service';
import categoriesService  from '../services/categories.service';
import JobCard            from '../components/JobCard';
import LoadingSpinner     from '../components/LoadingSpinner';

const JOB_TYPES = ['internship', 'part-time', 'freelance', 'full-time'];
const PAGE_SIZE = 10;

const JobsPage = () => {
  const [jobs,       setJobs]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  // Filter state — every change triggers a new API call
  const [search,      setSearch]      = useState('');
  const [categoryId,  setCategoryId]  = useState('');
  const [type,        setType]        = useState('');
  const [offset,      setOffset]      = useState(0);
  const [sortKey,    setSortKey]     = useState('date_desc');

  const SORT_FNS = {
    date_desc: byDateDesc,
    date_asc:  byDateAsc,
    title_asc: byTitleAsc,
    title_desc: byTitleDesc,
    type:      byType,
  };

  // Load categories once on mount for the filter dropdown
  useEffect(() => {
    categoriesService.list()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {});
  }, []);
  
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { limit: PAGE_SIZE, offset };
        if (search)     params.search      = search;
        if (categoryId) params.category_id = categoryId;
        if (type)       params.type        = type;

        const res = await jobsService.list(params);
        setJobs(res.data.jobs);
        setTotal(res.data.pagination.total);
      } catch {
        setError('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [search, categoryId, type, offset]);

  // When filters change, reset to page 1
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setOffset(0);
  };

  const pages      = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
      <p className="text-gray-500 text-sm mt-1">{total} listing{total !== 1 ? 's' : ''} found</p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search jobs…"
          value={search}
          onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
          className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="title_asc">Title (A-Z)</option>
          <option value="title_desc">Title (Z-A)</option>
          <option value="type">By Type</option>
        </select>

        <select
          value={categoryId}
          onChange={(e) => handleFilterChange(setCategoryId)(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => handleFilterChange(setType)(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All types</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">{t}</option>
          ))}
        </select>

        {(search || categoryId || type) && (
          <button
            onClick={() => {
              setSearch(''); setCategoryId(''); setType(''); setOffset(0);
            }}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 border border-gray-300 rounded-lg"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      <div className="mt-6">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-center text-red-500 text-sm py-12">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">No jobs match your filters.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {mergeSort(jobs, SORT_FNS[sortKey]).map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
            disabled={currentPage === 1}
            className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:border-gray-400"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {currentPage} of {pages}</span>
          <button
            onClick={() => setOffset((o) => o + PAGE_SIZE)}
            disabled={currentPage === pages}
            className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:border-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
