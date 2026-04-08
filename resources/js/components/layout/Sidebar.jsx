import React from 'react';
import {
    FaChartLine,
    FaCogs,
    FaLayerGroup,
    FaListAlt,
    FaTachometerAlt,
    FaUsers,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
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

    return (
        <aside
            className="text-white p-3 sidebar-desktop"
            style={{
                minHeight: '100vh',
                width: '270px',
                background: 'linear-gradient(180deg, #0d1b4c 0%, #08122f 100%)',
            }}
        >
            <div className="mb-4">
                <div className="fs-3 fw-bold">LEONI</div>
                <small className="text-light opacity-75">Efficiency Management</small>
            </div>

            <div className="nav flex-column gap-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center gap-3 px-3 py-3 rounded text-light sidebar-link ${
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
    );
}