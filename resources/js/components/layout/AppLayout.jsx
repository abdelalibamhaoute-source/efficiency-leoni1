/*import React from 'react';
import AppNavbar from './AppNavbar';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
    return (
        <div className="d-flex">
            <Sidebar />

            <div className="flex-grow-1 min-vh-100" style={{ backgroundColor: '#f4f7fb' }}>
                <AppNavbar />

                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}*/
import React, { useEffect, useState } from 'react';
import AppNavbar from './AppNavbar';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const openMobileSidebar = () => setMobileSidebarOpen(true);
    const closeMobileSidebar = () => setMobileSidebarOpen(false);

    useEffect(() => {
        if (!mobileSidebarOpen) {
            return;
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                closeMobileSidebar();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [mobileSidebarOpen]);

    return (
        <div className="app-shell">
            <div className="sidebar-desktop">
                <Sidebar />
            </div>

            {mobileSidebarOpen && (
                <>
                    <div
                        className="mobile-sidebar-backdrop"
                        onClick={closeMobileSidebar}
                    />

                    <div className="mobile-sidebar-panel">
                        <Sidebar mobile onNavigate={closeMobileSidebar} />
                    </div>
                </>
            )}

            <div className="app-content-wrapper">
                <AppNavbar onToggleSidebar={openMobileSidebar} />

                <main className="app-main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}