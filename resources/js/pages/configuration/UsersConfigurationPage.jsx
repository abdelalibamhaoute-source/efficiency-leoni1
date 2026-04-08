import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import ConfirmButton from '../../components/common/ConfirmButton';
import PageHeader from '../../components/common/PageHeader';
import UserForm from '../../components/forms/UserForm';

export default function UsersConfigurationPage() {
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadUsers = async (currentSearch = '') => {
        setLoading(true);
        setError('');

        try {
            const [usersResponse, teamsResponse] = await Promise.all([
                api.get('/users', { params: { search: currentSearch } }),
                api.get('/teams'),
            ]);

            setUsers(usersResponse.data.data);
            setTeams(teamsResponse.data.data || []);
        } catch (err) {
            setError('Erreur lors du chargement des utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        loadUsers(search);
    };

    const handleCreateOrUpdate = async (payload) => {
        setSubmitting(true);
        setMessage('');
        setError('');

        try {
            if (editingUser) {
                await api.patch(`/users/${editingUser.id}`, payload);
                setMessage('Utilisateur mis à jour avec succès.');
            } else {
                await api.post('/users', payload);
                setMessage('Utilisateur créé avec succès.');
            }

            setEditingUser(null);
            loadUsers(search);
        } catch (err) {
            setError(err?.response?.data?.message || 'Erreur lors de l’enregistrement.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusToggle = async (user) => {
        setMessage('');
        setError('');

        try {
            await api.patch(`/users/${user.id}/status`, {
                is_active: !user.is_active,
            });

            setMessage('Statut utilisateur mis à jour.');
            loadUsers(search);
        } catch (err) {
            setError(err?.response?.data?.message || 'Erreur lors du changement de statut.');
        }
    };

    const handlePasswordReset = async (userId) => {
       const password = window.prompt('Saisir le nouveau mot de passe utilisateur :');

        if (!password) {
            return;
        }

        try {
            await api.patch(`/users/${userId}/password`, {
                password,
                password_confirmation: password,
            });

            setMessage('Mot de passe mis à jour avec succès.');
        } catch (err) {
            setError(err?.response?.data?.message || 'Erreur lors du changement du mot de passe.');
        }
    };

    return (
        <div>
            <PageHeader
                title="Configuration utilisateurs"
                subtitle="Créer, modifier, activer et gérer les comptes."
            />

            <AlertMessage type="success" message={message} />
            <AlertMessage type="danger" message={error} />

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-3">
                                {editingUser ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
                            </h5>

                            <UserForm
                                initialData={editingUser}
                                onSubmit={handleCreateOrUpdate}
                                submitting={submitting}
                                teams={teams}
                                isEdit={!!editingUser}
                            />

                            {editingUser && (
                                <button
                                    className="btn btn-secondary mt-3"
                                    onClick={() => setEditingUser(null)}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <form className="row g-2 mb-3" onSubmit={handleSearch}>
                                <div className="col-md-9">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Rechercher un utilisateur..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <button type="submit" className="btn btn-dark w-100">
                                        Rechercher
                                    </button>
                                </div>
                            </form>

                            {loading ? (
                                <p>Chargement...</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>Nom</th>
                                                <th>Email</th>
                                                <th>Rôle</th>
                                                <th>Équipe</th>
                                                <th>Actif</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length > 0 ? (
                                                users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>{user.name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.role}</td>
                                                        <td>{user.team?.name || '-'}</td>
                                                        <td>
                                                            <span className={`badge ${user.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                                {user.is_active ? 'Oui' : 'Non'}
                                                            </span>
                                                        </td>
                                                        <td className="d-flex flex-wrap gap-2">
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => setEditingUser(user)}
                                                            >
                                                                Modifier
                                                            </button>

                                                            <button
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() => handlePasswordReset(user.id)}
                                                            >
                                                                Password
                                                            </button>

                                                            <ConfirmButton
                                                                className="btn btn-secondary btn-sm"
                                                                confirmMessage={`Changer le statut de ${user.name} ?`}
                                                                onConfirm={() => handleStatusToggle(user)}
                                                            >
                                                                {user.is_active ? 'Désactiver' : 'Activer'}
                                                            </ConfirmButton>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center">
                                                        Aucun utilisateur trouvé.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}