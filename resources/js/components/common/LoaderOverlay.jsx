import React from 'react';

export default function LoaderOverlay({ text = 'Chargement...' }) {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <div className="spinner-border mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="text-muted">{text}</div>
        </div>
    );
}