import React from 'react';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

export default function AppNavbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3">
            <div className="container-fluid">
                <span className="navbar-brand fw-bold fs-3 mb-0">Efficiency LEONI</span>

                <div className="d-flex align-items-center gap-3">
                    <div className="text-end">
                        <div className="fw-semibold">{user?.name}</div>
                        <div className="text-muted small">{user?.role}</div>
                    </div>

                    <FaUserCircle size={30} className="text-secondary" />

                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={logout}
                    >
                        <FaSignOutAlt className="me-1" />
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    );
}