import React from 'react';
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
}