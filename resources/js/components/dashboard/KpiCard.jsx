import React from 'react';

export default function KpiCard({ title, value, subtitle, accent = 'primary' }) {
    const colors = {
        primary: 'linear-gradient(135deg, #0d6efd 0%, #3b82f6 100%)',
        success: 'linear-gradient(135deg, #198754 0%, #22c55e 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        danger: 'linear-gradient(135deg, #dc3545 0%, #f43f5e 100%)',
    };

    return (
        <div
            className="card border-0 text-white h-100"
            style={{
                background: colors[accent],
                borderRadius: '16px',
            }}
        >
            <div className="card-body">
                <div className="kpi-card-title text-white opacity-75">
                    {title}
                </div>

                <div className="kpi-card-value text-white">
                    {value}
                </div>

                <div className="kpi-card-subtitle text-white opacity-75">
                    {subtitle}
                </div>
            </div>
        </div>
    );
}