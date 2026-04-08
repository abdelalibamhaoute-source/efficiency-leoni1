import React from 'react';

export default function AlertMessage({ type = 'success', message }) {
    if (!message) {
        return null;
    }

    return (
        <div className={`alert alert-${type}`} role="alert">
            {message}
        </div>
    );
}