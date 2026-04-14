import React from 'react';
import {
    FaChartLine,
    FaCogs,
    FaLayerGroup,
    FaListAlt,
    FaTachometerAlt,
    FaTimes,
    FaUsers,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ mobile = false, onNavigate = null, onClose ,isOpen}) {
    const { isAdmin } = useAuth();

    const commonLinks = [
        { to: '/', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { to: '/calculations', label: 'Calculer l’efficience', icon: <FaCogs /> },
        { to: '/history', label: 'Historique', icon: <FaListAlt /> },
        { to: '/statistics', label: 'Statistiques', icon: <FaChartLine /> },
    ];

    const adminLinks = [
       
        { to: '/teams', label: 'Gestion des équipes', icon: <FaUsers /> },
        { to: '/references', label: 'Gestion des références', icon: <FaLayerGroup /> },
        { to: '/configuration/users', label: 'Configuration', icon: <FaCogs /> },
        
    ];

    const links = isAdmin ? [...commonLinks, ...adminLinks] : commonLinks;

    const handleNavigation = () => {
        if (mobile && onNavigate) {
            onNavigate();
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 998,
                    }}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    left: isOpen ? '0' : '-280px',
                    width: '270px',
                    height: '100%',
                    background: 'linear-gradient(180deg, #0d1b4c 0%, #08122f 100%)',
                    color: '#fff',
                    padding: '20px',
                    transition: '0.3s ease',
                    zIndex: 999,
                }}
            >
                {/* CLOSE BUTTON */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <div className="fs-4 fw-bold">LEONI</div>
                        <small className="opacity-75">Efficiency Management</small>
                    </div>

                    <button className="btn btn-sm btn-light" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="nav flex-column gap-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `nav-link d-flex align-items-center gap-3 px-3 py-3 rounded text-light ${
                                    isActive ? 'active-link' : ''
                                }`
                            }
                        >
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </div>
            </aside>
        </>
    );
}