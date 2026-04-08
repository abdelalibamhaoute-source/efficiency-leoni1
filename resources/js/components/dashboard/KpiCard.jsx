

//export default function KpiCard({ title, value, subtitle, className = '' }) {
   // return (
       //<div className={`card border-0 shadow-sm h-100 ${className}`}>
           // <div className="card-body">
                //<p className="text-muted mb-2">{title}</p>
                //<h3 className="fw-bold mb-1">{value}</h3>
                //{subtitle && <small className="text-secondary">{subtitle}</small>}
            //</div>
        //</div>
    //);
//}
import React from 'react';

export default function KpiCard({ title, value, subtitle, accent = 'primary' }) {
    const accents = {
        primary: 'border-start border-4 border-primary',
        success: 'border-start border-4 border-success',
        danger: 'border-start border-4 border-danger',
        warning: 'border-start border-4 border-warning',
    };

    return (
        <div className={`card h-100 ${accents[accent] || accents.primary}`}>
            <div className="card-body">
                <div className="kpi-card-title">{title}</div>
                <div className="kpi-card-value mt-2">{value}</div>
                {subtitle && <div className="kpi-card-subtitle mt-2">{subtitle}</div>}
            </div>
        </div>
    );
}