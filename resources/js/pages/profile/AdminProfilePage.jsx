import React, { useState } from 'react';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminProfilePage() {
    const { user } = useAuth();

    const [form, setForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage('');
        setError('');
        setValidationErrors({});

        try {
            const response = await api.patch('/profile/password', form);

            setMessage(response.data.message || 'Mot de passe mis à jour avec succès.');
            setForm({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        } catch (err) {
            if (err?.response?.status === 422) {
                setValidationErrors(err.response.data.errors || {});
                setError('Veuillez corriger les erreurs du formulaire.');
            } else {
                setError(err?.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Profil administrateur"
                subtitle="Consulter vos informations et modifier votre mot de passe."
            />

            <AlertMessage type="success" message={message} />
            <AlertMessage type="danger" message={error} />

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-3">Informations du compte</h5>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Nom</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={user?.name || ''}
                                    disabled
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={user?.email || ''}
                                    disabled
                                />
                            </div>

                            <div className="mb-0">
                                <label className="form-label fw-semibold">Rôle</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={user?.role || ''}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-3">Modifier le mot de passe</h5>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Mot de passe actuel
                                    </label>
                                    <input
                                        type="password"
                                        name="current_password"
                                        className={`form-control ${validationErrors.current_password ? 'is-invalid' : ''}`}
                                        value={form.current_password}
                                        onChange={handleChange}
                                    />
                                    {validationErrors.current_password && (
                                        <div className="invalid-feedback">
                                            {validationErrors.current_password[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                    {validationErrors.password && (
                                        <div className="invalid-feedback">
                                            {validationErrors.password[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Confirmer le mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        className="form-control"
                                        value={form.password_confirmation}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Enregistrement...' : 'Mettre à jour le mot de passe'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}