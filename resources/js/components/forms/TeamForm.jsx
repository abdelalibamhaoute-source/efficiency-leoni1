import React, { useEffect, useState } from 'react';

export default function TeamForm({ initialData, onSubmit, submitting }) {
    const [form, setForm] = useState({
        name: '',
        is_active: true,
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                is_active: !!initialData.is_active,
            });
        }
    }, [initialData]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Nom de l’équipe</label>
                <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="team_active"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="team_active">
                    Équipe active
                </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
        </form>
    );
}