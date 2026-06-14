// client/src/pages/HomePage.jsx

import { Link }    from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {/*
        Hero section with a background image.
        - bg-cover scales the image to fully cover the container, cropping as needed
        - bg-center keeps the focal point of the image centred regardless of screen size
        - The dark overlay div sits between the image and the text — without it,
          white text becomes unreadable on light parts of a photo
      */}
      <div
        className="relative h-[480px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('./images/hero-bg.jpg')" }}
      >
        {/* Overlay — darkens the image so white text stays readable everywhere */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Content sits above the overlay because of relative + z-10 */}
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <span className="inline-block text-xs font-semibold tracking-widest text-indigo-300 uppercase mb-4">
            Student Job Board
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Find internships and gigs<br />built for students
          </h1>
          <p className="text-gray-200 mt-4 text-lg">
            HustleBoard connects students with employers offering internships, part-time roles, and freelance work.
          </p>

          <div className="mt-8 flex gap-3 justify-center flex-wrap">
            <Link
              to="/jobs"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Browse all jobs
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="bg-white/10 border border-white/40 hover:bg-white/20 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors backdrop-blur-sm"
              >
                Create an account
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to={`/dashboard/${user.role}`}
                className="bg-white/10 border border-white/40 hover:bg-white/20 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors backdrop-blur-sm"
              >
                Go to dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
