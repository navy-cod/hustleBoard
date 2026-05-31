import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    // Determine which dashboard link to show based on role
    const dashboardPath = user
        ? `/dashboard/${user.role}`
        : `/login`;

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link to="/" className="text-lg font-bold text-indigo-600 tracking-tight">
                    HustleBoard
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/jobs" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                        Browse Jobs 
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to={dashboardPath}
                                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout}
                                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition-colors">
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"
                                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                                Log in
                            </Link>
                            <Link to="/register"
                                className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                            Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>  
    );
};

export default Navbar;