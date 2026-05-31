import { Link } from 'react-router-dom';

const TYPE_STYLES = {
  internship:  'bg-blue-50  text-blue-700',
  'part-time': 'bg-green-50 text-green-700',
  freelance:   'bg-amber-50 text-amber-700',
  'full-time': 'bg-indigo-50 text-indigo-700',
};

const JobCard = ({ job }) => {
  const date = new Date(job.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{job.employer_name}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${TYPE_STYLES[job.type] || 'bg-gray-100 text-gray-600'}`}>
          {job.type}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
        <span>{job.category_name}</span>
        <span>·</span>
        <span>{job.location}</span>
        <span>·</span>
        <span>{date}</span>
      </div>
    </Link>
  );
};

export default JobCard;
