import React from 'react';

export default function StatBadge({ status }) {
    const isAbove = status === 'above_target';

    return (
        <span className={`badge ${isAbove ? 'bg-success' : 'bg-danger'}`}>
            {isAbove ? 'Au-dessus' : 'En-dessous'}
        </span>
    );
}