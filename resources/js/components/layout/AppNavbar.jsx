import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaSignOutAlt, FaUserCircle, FaUserCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AppNavbar({ onToggleSidebar }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleGoToProfile = () => {
        setOpenMenu(false);
        navigate('/profile');
    };

    const handleLogout = async () => {
        setOpenMenu(false);
        await logout();
    };

    return (
        <nav className="navbar bg-white border-bottom px-3 px-md-4 py-3">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <button
                        type="button"
                        className="btn btn-light border d-inline-flex align-items-center justify-content-center"
                        onClick={onToggleSidebar}
                        aria-label="Ouvrir le menu"
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                        }}
                    >
                        <FaBars />
                    </button>

                    <div>
                        <div className="topbar-title mb-0">Efficiency LEONI</div>
                        <div className="text-muted small">Gestion de performance</div>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3" ref={menuRef}>
                    <div className="text-end d-none d-md-block">
                        <div className="fw-semibold">{user?.name}</div>
                        <div className="text-muted small">{user?.role}</div>
                    </div>

                    <div className="position-relative">
                        <button
                            type="button"
                            className="btn btn-light border d-inline-flex align-items-center justify-content-center"
                            onClick={() => setOpenMenu((prev) => !prev)}
                            aria-label="Menu utilisateur"
                            style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: '50%',
                            }}
                        >
                            <FaUserCircle size={24} className="text-primary" />
                        </button>

                        {openMenu && (
                            <div
                                className="position-absolute end-0 mt-2 bg-white shadow rounded-4 border overflow-hidden"
                                style={{
                                    minWidth: '220px',
                                    zIndex: 1050,
                                }}
                            >
                                <div className="px-3 py-3 border-bottom bg-light">
                                    <div className="fw-semibold">{user?.name}</div>
                                    <div className="text-muted small">{user?.email}</div>
                                </div>

                                <button
                                    type="button"
                                    className="dropdown-item d-flex align-items-center gap-2 px-3 py-3"
                                    onClick={handleGoToProfile}
                                >
                                    <FaUserCog className="text-primary" />
                                    <span>Mon profil</span>
                                </button>

                                <button
                                    type="button"
                                    className="dropdown-item d-flex align-items-center gap-2 px-3 py-3 text-danger"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt />
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}