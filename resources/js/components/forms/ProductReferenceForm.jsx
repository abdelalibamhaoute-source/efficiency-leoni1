import React, { useEffect, useState } from 'react';

export default function ProductReferenceForm({ initialData, onSubmit, submitting }) {
    const [form, setForm] = useState({
        code: '',
        gamme_time: '',
        is_active: true,
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                code: initialData.code || '',
                gamme_time: initialData.gamme_time || '',
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
        onSubmit({
            ...form,
            gamme_time: Number(form.gamme_time),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Code référence</label>
                <input
                    type="text"
                    name="code"
                    className="form-control"
                    value={form.code}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Temps gamme</label>
                <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="gamme_time"
                    className="form-control"
                    value={form.gamme_time}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="reference_active"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="reference_active">
                    Référence active
                </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
        </form>
    );
}