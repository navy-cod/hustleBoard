const STYLES = {
    pending: 'bg-yellow-50 text-yellow-700',
    reviewed: 'bg-blue-50 text-blue-700',
    accepted: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
    open: 'bg-indigo-50 text-indigo-700',
    closed: 'bg-gray-50 text-gray-700',
    draft: 'bg-amber-50 text-amber-700',
};

const StatusBadge = ({ status }) => (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STYLES[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
    </span>
);

export default StatusBadge;
