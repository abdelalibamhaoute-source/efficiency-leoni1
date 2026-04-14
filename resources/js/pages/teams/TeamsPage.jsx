import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import ConfirmButton from '../../components/common/ConfirmButton';
import PageHeader from '../../components/common/PageHeader';
import TeamForm from '../../components/forms/TeamForm';

export default function TeamsPage() {
    const [teams, setTeams] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadTeams = async (page = 1, currentSearch = search) => {
        setLoading(true);
        setError('');

        try {
            const response = await api.get('/teams', {
                params: {
                    page,
                    search: currentSearch,
                },
            });

            setTeams(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
            });
        } catch (err) {
            setError('Erreur lors du chargement des équipes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeams();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        loadTeams(1, search);
    };

    const handleCreateOrUpdate = async (payload) => {
        setSubmitting(true);
        setMessage('');
        setError('');

        try {
            if (editingTeam) {
                await api.put(`/teams/${editingTeam.id}`, payload);
                setMessage('Équipe mise à jour avec succès.');
            } else {
                await api.post('/teams', payload);
                setMessage('Équipe créée avec succès.');
            }

            setEditingTeam(null);
            loadTeams();
        } catch (err) {
            setError(err?.response?.data?.message || 'Erreur lors de l’enregistrement.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (teamId) => {
        setMessage('');
        setError('');

        try {
            await api.delete(`/teams/${teamId}`);
            setMessage('Équipe supprimée avec succès.');
            loadTeams();
        } catch (err) {
            setError(err?.response?.data?.message || 'Erreur lors de la suppression.');
        }
    };

    return (
        <div>
            <PageHeader
                title="Gestion des équipes"
                subtitle="Créer, modifier et supprimer les équipes."
            />

            <AlertMessage type="success" message={message} />
            <AlertMessage type="danger" message={error} />

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-3 d-flex align-items-center gap-2">
                                <FaPlus className="text-primary" />
                                <span>{editingTeam ? 'Modifier équipe' : 'Nouvelle équipe'}</span>
                            </h5>

                            <TeamForm
                                initialData={editingTeam}
                                onSubmit={handleCreateOrUpdate}
                                submitting={submitting}
                            />

                            {editingTeam && (
                                <button
                                    className="btn btn-secondary mt-3"
                                    onClick={() => setEditingTeam(null)}
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
                                        placeholder="Rechercher une équipe..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <button type="submit" className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2">
                                        <FaSearch />
                                        <span>Rechercher</span>
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
                                                <th>Active</th>
                                                <th>Users</th>
                                                <th>Historiques</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teams.length > 0 ? (
                                                teams.map((team) => (
                                                    <tr key={team.id}>
                                                        <td>{team.name}</td>
                                                        <td>
                                                            <span className={`badge ${team.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                                {team.is_active ? 'Oui' : 'Non'}
                                                            </span>
                                                        </td>
                                                        <td>{team.users_count}</td>
                                                        <td>{team.efficiency_histories_count}</td>
                                                        <td className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
                                                                onClick={() => setEditingTeam(team)}
                                                            >
                                                                <FaEdit />
                                                                <span className="d-none d-md-inline"></span>
                                                            </button>

                                                            <ConfirmButton
                                                                className="btn btn-danger btn-sm d-inline-flex align-items-center gap-2"
                                                                onConfirm={() => handleDelete(team.id)}
                                                            >
                                                                <FaTrash />
                                                                <span className="d-none d-md-inline"></span>
                                                            </ConfirmButton>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">
                                                        Aucune équipe trouvée.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {pagination && pagination.last_page > 1 && (
                                <div className="d-flex gap-2">
                                    {Array.from({ length: pagination.last_page }).map((_, index) => (
                                        <button
                                            key={index + 1}
                                            className={`btn btn-sm ${
                                                pagination.current_page === index + 1
                                                    ? 'btn-primary'
                                                    : 'btn-outline-primary'
                                            }`}
                                            onClick={() => loadTeams(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}