import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('hb_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('hb_token'));
    const [loading, setLoading] = useState(() => !!localStorage.getItem('hb_token'));

    useEffect(() => {
        if (!token) {
            return;
        }

        let active = true;
        authService.getMe()
            .then((res) => {
                if (active) setUser(res.data.user);
            })
            .catch(() => {
                if (!active) return;
                localStorage.removeItem('hb_token');
                localStorage.removeItem('hb_user');
                setToken(null);
                setUser(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [token]);

    //called after a successful login or registration API response
    const login = (newToken, newUser) => {
        localStorage.setItem('hb_token', newToken);
        localStorage.setItem('hb_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('hb_token');
        localStorage.removeItem('hb_user');
        setToken(null);
        setUser(null);
    };

    const value = { user, token, login, logout, isAuthenticated: !!token };

    if (loading) return null;

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

//Custom hook
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};