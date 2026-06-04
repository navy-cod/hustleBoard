import { Link } from 'react-router-dom';

const TYPE_STYLES = {
  internship:  'bg-blue-900 text-blue-200',
  'part-time': 'bg-green-900 text-green-200',
  freelance:   'bg-amber-900 text-amber-200',
  'full-time': 'bg-indigo-900 text-indigo-200',
};

const JobCard = ({ job }) => {
  const date = new Date(job.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{job.title}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{job.employer_name}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${TYPE_STYLES[job.type] || 'bg-slate-800 text-slate-300'}`}>
          {job.type}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
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
