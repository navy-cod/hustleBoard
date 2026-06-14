import { useState, useEffect } from 'react';
import categoriesService from '../services/categories.service';
import jobService from '../services/jobs.service';

const JOB_TYPES = [ 'internship', 'part-time', 'freelance', 'full-time' ];
const STATUSES = [ 'open', 'closed', 'draft' ];

const JobFormModal = ({ job, onClose, onSuccess }) => {
    const isEdit = !!job;

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        title: job?.title || '',
        description: job?.description || '',
        location: job?.location || '',
        type: job?.type || 'internship',
        category_id: job?.category_id || '',
        status: job?.status || 'open',
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    //Load categories for the dropdown
    useEffect(() => {
        categoriesService.list()
            .then((res) => {
                setCategories(res.data.categories);
                if (!isEdit && res.data.categories.length > 0) {
                    setForm((prev) => ({ ...prev, category_id: res.data.categories[0].id }));
                }
            })
            .catch(() => {});
    }, []);

    const handleChange = (e) => 
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setErrors({});
        setLoading(true);

        try {
            if (isEdit) {
                await jobService.update(job.id, form);
            } else {
                await jobService.create(form);
            }
            onSuccess();
        } catch (err) {
            //map server-side validation errors to specific fields
            if (err.response?.data?.errors) {
                const fieldErrors = {};
                err.response.data.errors.forEach(({ field, message }) => {
                    fieldErrors[field] = message;
                });
                setErrors(fieldErrors);
            } else {
                setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-x1 my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold text-gray-900">
                    {isEdit ? 'Edit Listing' : 'Post a new Job'}
                </h2>

                {apiError && (
                    <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray700 block mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g Junior Software Engineer Intern"
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.title ? 'border-red-400' : 'border-gray-300'
                            }`}
                        />
                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p> }
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray700 block mb-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the role, responsibilities, and requirements (min. 20 characters)..."
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                                errors.description ? 'border-red-400' : 'border-gray-300'
                            }`}
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p> }
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-gray700 block mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g Nairobi, Kenya or Remote"
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    errors.location ? 'border-red-400' : 'border-gray-300'
                                }`}
                            />
                            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p> }
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray700 block mb-1">Category</label>
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-gray700 block mb-1">Type</label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {JOB_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        {/* Status is only editable on existing jobs. New jobs always start as "open" */}
                        {isEdit && (
                            <div>
                                <label className="text-sm font-medium text-gray700 block mb-1">Status</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-2">
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
                            { loading ? 'Saving...' : isEdit ? 'Save changes' : 'Post Listing' }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
    };

export default JobFormModal;