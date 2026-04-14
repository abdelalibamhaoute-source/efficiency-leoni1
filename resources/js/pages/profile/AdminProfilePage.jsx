
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaIdBadge, FaLock, FaSave, FaUser, FaUserShield } from 'react-icons/fa';
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
                subtitle="Gérer vos informations personnelles et sécuriser votre compte."
            />

            <AlertMessage type="success" message={message} />
            <AlertMessage type="danger" message={error} />

            <div className="row g-4">
                <div className="col-xl-4 col-lg-5">
                    <div className="card border-0 shadow-sm profile-summary-card h-100">
                        <div className="card-body">
                            <div className="profile-avatar-wrapper mb-4">
                                <div className="profile-avatar-icon">
                                    <FaUserShield />
                                </div>
                            </div>

                            <h4 className="fw-bold mb-1 text-center">{user?.name || 'Administrateur'}</h4>
                            <p className="text-muted text-center mb-4">
                                {user?.email || 'admin@leoni.local'}
                            </p>

                            <div className="profile-info-list">
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <div className="profile-info-label">Nom</div>
                                        <div className="profile-info-value">{user?.name || '-'}</div>
                                    </div>
                                </div>

                                <div className="profile-info-item">
                                    <div className="profile-info-icon">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <div className="profile-info-label">Email</div>
                                        <div className="profile-info-value">{user?.email || '-'}</div>
                                    </div>
                                </div>

                                <div className="profile-info-item">
                                    <div className="profile-info-icon">
                                        <FaIdBadge />
                                    </div>
                                    <div>
                                        <div className="profile-info-label">Rôle</div>
                                        <div className="profile-info-value text-capitalize">
                                            {user?.role || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-security-box mt-4">
                                <div className="fw-semibold mb-1">Sécurité</div>
                                <small className="text-muted">
                                    Utilisez un mot de passe fort et unique pour protéger votre compte.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-8 col-lg-7">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <FaUser className="text-primary" />
                                        <h5 className="mb-0">Informations du compte</h5>
                                    </div>

                                    <form onSubmit={handleProfileSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
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

                                            <div className="col-md-6">
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

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Rôle</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={user?.role || ''}
                                                    disabled
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Statut</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={user?.is_active ? 'Compte actif' : 'Compte inactif'}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary d-inline-flex align-items-center gap-2"
                                                disabled={profileSubmitting}
                                            >
                                                <FaSave />
                                                <span>
                                                    {profileSubmitting ? 'Enregistrement...' : 'Mettre à jour le profil'}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <FaLock className="text-primary" />
                                        <h5 className="mb-0">Modifier le mot de passe</h5>
                                    </div>

                                    <form onSubmit={handlePasswordSubmit}>
                                        <div className="row g-3">
                                            <div className="col-12">
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

                                            <div className="col-md-6">
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

                                            <div className="col-md-6">
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
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-dark d-inline-flex align-items-center gap-2"
                                                disabled={passwordSubmitting}
                                            >
                                                <FaLock />
                                                <span>
                                                    {passwordSubmitting ? 'Enregistrement...' : 'Mettre à jour le mot de passe'}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}