import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminProfilePage() {
    const { user, refreshUser } = useAuth();

    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [profileSubmitting, setProfileSubmitting] = useState(false);
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        setProfileForm({
            name: user?.name || '',
            email: user?.email || '',
        });
    }, [user]);

    const handleProfileChange = (event) => {
        const { name, value } = event.target;

        setProfileForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;

        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        setProfileSubmitting(true);
        setMessage('');
        setError('');
        setValidationErrors({});

        try {
            const response = await api.patch('/profile', profileForm);
            await refreshUser();
            setMessage(response.data.message || 'Profil mis à jour avec succès.');
        } catch (err) {
            if (err?.response?.status === 422) {
                setValidationErrors(err.response.data.errors || {});
                setError('Veuillez corriger les erreurs du formulaire.');
            } else {
                setError(err?.response?.data?.message || 'Erreur lors de la mise à jour du profil.');
            }
        } finally {
            setProfileSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setPasswordSubmitting(true);
        setMessage('');
        setError('');
        setValidationErrors({});

        try {
            const response = await api.patch('/profile/password', passwordForm);

            setMessage(response.data.message || 'Mot de passe mis à jour avec succès.');
            setPasswordForm({
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
            setPasswordSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Profil administrateur"
                subtitle="Consulter vos informations et gérer votre compte."
            />

            <AlertMessage type="success" message={message} />
            <AlertMessage type="danger" message={error} />

            <div className="row g-4">
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-3">Informations du compte</h5>

                            <form onSubmit={handleProfileSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Nom</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                                        value={profileForm.name}
                                        onChange={handleProfileChange}
                                    />
                                    {validationErrors.name && (
                                        <div className="invalid-feedback">
                                            {validationErrors.name[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                    />
                                    {validationErrors.email && (
                                        <div className="invalid-feedback">
                                            {validationErrors.email[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Rôle</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={user?.role || ''}
                                        disabled
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={profileSubmitting}
                                >
                                    {profileSubmitting ? 'Enregistrement...' : 'Mettre à jour le profil'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-3">Modifier le mot de passe</h5>

                            <form onSubmit={handlePasswordSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Mot de passe actuel
                                    </label>
                                    <input
                                        type="password"
                                        name="current_password"
                                        className={`form-control ${validationErrors.current_password ? 'is-invalid' : ''}`}
                                        value={passwordForm.current_password}
                                        onChange={handlePasswordChange}
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
                                        value={passwordForm.password}
                                        onChange={handlePasswordChange}
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
                                        value={passwordForm.password_confirmation}
                                        onChange={handlePasswordChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={passwordSubmitting}
                                >
                                    {passwordSubmitting ? 'Enregistrement...' : 'Mettre à jour le mot de passe'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}