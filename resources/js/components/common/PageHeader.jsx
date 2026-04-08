import React from 'react';

export default function PageHeader({ title, subtitle, action = null }) {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
                <h2 className="page-section-title">{title}</h2>
                {subtitle && <p className="page-section-subtitle">{subtitle}</p>}
            </div>

            {action && <div>{action}</div>}
        </div>
    );
}