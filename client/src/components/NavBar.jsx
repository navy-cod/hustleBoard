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
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link to="/" className="text-lg font-bold text-indigo-400 tracking-tight">
                    HustleBoard
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/jobs" className="text-sm text-slate-300 hover:text-indigo-400 transition-colors">
                        Browse Jobs 
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to={dashboardPath}
                                className="text-sm text-slate-300 hover:text-indigo-400 transition-colors">
                                Dashboard
                            </Link>
                            <button onClick={handleLogout}
                                className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded transition-colors">
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"
                                className="text-sm text-slate-300 hover:text-indigo-400 transition-colors font-medium">
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