import React from 'react';

export default function ConfirmButton({
    children,
    onConfirm,
    className = 'btn btn-danger btn-sm',
    confirmMessage = 'Confirmer cette action ?',
    disabled = false,
    type = 'button',
}) {
    const handleClick = () => {
        const confirmed = window.confirm(confirmMessage);

        if (confirmed) {
            onConfirm();
        }
    };

    return (
        <button
            type={type}
            className={className}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}