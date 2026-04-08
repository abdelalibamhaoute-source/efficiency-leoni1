import React, { useEffect, useState } from 'react';

export default function UserForm({
    initialData,
    onSubmit,
    submitting,
    teams = [],
    isEdit = false,
}) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'shift_leader',
        team_id: '',
        is_active: true,
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                email: initialData.email || '',
                password: '',
                password_confirmation: '',
                role: initialData.role || 'shift_leader',
                team_id: initialData.team_id || '',
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

        const payload = {
            name: form.name,
            email: form.email,
            role: form.role,
            team_id: form.team_id || null,
            is_active: form.is_active,
        };

        if (!isEdit || form.password) {
            payload.password = form.password;
            payload.password_confirmation = form.password_confirmation;
        }

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Nom</label>
                <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>

            {!isEdit && (
                <>
                    <div className="mb-3">
                        <label className="form-label">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirmation mot de passe</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            className="form-control"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </>
            )}

            <div className="mb-3">
                <label className="form-label">Rôle</label>
                <select
                    name="role"
                    className="form-select"
                    value={form.role}
                    onChange={handleChange}
                    required
                >
                    <option value="shift_leader">Shift Leader</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Équipe</label>
                <select
                    name="team_id"
                    className="form-select"
                    value={form.team_id}
                    onChange={handleChange}
                >
                    <option value="">Aucune</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="user_active"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="user_active">
                    Utilisateur actif
                </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
        </form>
    );
}