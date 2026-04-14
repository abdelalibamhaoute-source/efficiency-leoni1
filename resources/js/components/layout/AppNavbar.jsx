import React from 'react';
import { FaBars, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

export default function AppNavbar({ onToggleSidebar }) {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom px-3 px-md-4 py-3 app-topbar">
            <div className="container-fluid px-0">
                <div className="d-flex align-items-center gap-3">
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm mobile-menu-button"
                        onClick={onToggleSidebar}
                        aria-label="Ouvrir le menu"
                    >
                        <FaBars />
                    </button>

                    <div>
                        <div className="topbar-title">Efficiency LEONI</div>
                        <div className="text-muted small d-none d-md-block">
                            Gestion de performance
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3 mobile-user-block">
                    <div className="text-end">
                        <div className="fw-semibold">{user?.name}</div>
                        <div className="text-muted small d-none d-sm-block">
                            {user?.role}
                        </div>
                    </div>

                    <FaUserCircle size={30} className="text-secondary flex-shrink-0" />

                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-2"
                        onClick={logout}
                    >
                        <FaSignOutAlt />
                        <span className="d-none d-sm-inline">Déconnexion</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}