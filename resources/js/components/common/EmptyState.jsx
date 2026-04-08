//import React from 'react';

/*export default function EmptyState({ title = 'Aucune donnée', description = 'Aucun résultat à afficher.' }) {
    return (
        <div className="text-center py-5">
            <h5 className="fw-bold mb-2">{title}</h5>
            <p className="text-muted mb-0">{description}</p>
        </div>
    );
}*/
import React from 'react';

export default function EmptyState({
    title = 'Aucune donnée',
    description = 'Aucun résultat à afficher.',
}) {
    return (
        <div className="empty-state-box">
            <h5 className="fw-bold mb-2">{title}</h5>
            <p className="mb-0">{description}</p>
        </div>
    );
}