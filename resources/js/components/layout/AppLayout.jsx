import React, { useState } from 'react';
import AppNavbar from './AppNavbar';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main */}
            <div className="flex-grow-1 min-vh-100" style={{ backgroundColor: '#f4f7fb' }}>
                <AppNavbar onToggleSidebar={() => setSidebarOpen(true)} />

                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}