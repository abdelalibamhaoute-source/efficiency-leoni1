import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const fetchMe = async () => {
        try {
            const response = await api.get('/me');
            setUser(response.data.user);
        } catch (error) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMe();
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (payload) => {
        const response = await api.post('/login', payload);

        const receivedToken = response.data.token;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(response.data.user);

        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            // حتى إذا فشل request، نمسحو session local
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    const value = useMemo(() => ({
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        isShiftLeader: user?.role === 'shift_leader',
        login,
        logout,
        refreshUser: fetchMe,
    }), [user, token, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}