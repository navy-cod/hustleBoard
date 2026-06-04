const STYLES = {
    pending: 'bg-yellow-900 text-yellow-200',
    reviewed: 'bg-blue-900 text-blue-200',
    accepted: 'bg-green-900 text-green-200',
    rejected: 'bg-red-900 text-red-200',
    open: 'bg-indigo-900 text-indigo-200',
    closed: 'bg-slate-700 text-slate-200',
    draft: 'bg-amber-900 text-amber-200',
};

const StatusBadge = ({ status }) => (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STYLES[status] || 'bg-slate-800 text-slate-300'}`}>
        {status}
    </span>
);

export default StatusBadge;
