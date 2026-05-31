import { Link }      from 'react-router-dom';
import { useAuth }   from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <span className="inline-block text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-4">
        Student Job Board
      </span>
      <h1 className="text-4xl font-bold text-gray-900 leading-tight">
        Find internships and gigs<br />built for students
      </h1>
      <p className="text-gray-500 mt-4 text-lg max-w-lg mx-auto">
        HustleBoard connects students with employers offering internships, part-time roles, and freelance work.
      </p>

      <div className="mt-8 flex gap-3 justify-center">
        <Link
          to="/jobs"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Browse all jobs
        </Link>
        {!isAuthenticated && (
          <Link
            to="/register"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Create an account
          </Link>
        )}
        {isAuthenticated && (
          <Link
            to={`/dashboard/${user.role}`}
            className="border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Go to dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;
