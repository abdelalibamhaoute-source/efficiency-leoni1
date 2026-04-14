import React, { useEffect, useState } from 'react';
import { FaSearch, FaTrash } from 'react-icons/fa';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import EmptyState from '../../components/common/EmptyState';
import LoaderOverlay from '../../components/common/LoaderOverlay';
import StatBadge from '../../components/common/StatBadge';
import { formatDateTime, formatPercent } from '../../utils/formatters';

export default function EfficiencyHistoryPage() {
    const { isAdmin } = useAuth();

    const [teams, setTeams] = useState([]);
    const [histories, setHistories] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        team_id: '',
        status: '',
        date_from: '',
        date_to: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [deleteFilters, setDeleteFilters] = useState({
        team_ids: [],
        date_from: '',
        date_to: '',
    });
    const [deleting, setDeleting] = useState(false);

    const loadTeams = async () => {
        if (!isAdmin) return;

        try {
            const response = await api.get('/teams');
            setTeams(response.data.data || []);
        } catch (err) {
            // ignore secondaire
        }
    };

    const loadHistories = async (page = 1, currentFilters = filters) => {
        setLoading(true);
        setError('');

        try {
            const response = await api.get('/efficiency-histories', {
                params: {
                    page,
                    ...currentFilters,
                },
            });

            setHistories(response.data.data || []);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
            });
        } catch (err) {
            setError('Erreur lors du chargement de l’historique.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeams();
        loadHistories();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        loadHistories(1, filters);
    };

    const handleDeleteFilterChange = (event) => {
        const { name, value } = event.target;

        setDeleteFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTeamSelection = (teamId) => {
        setDeleteFilters((prev) => {
            const exists = prev.team_ids.includes(teamId);

            return {
                ...prev,
                team_ids: exists
                    ? prev.team_ids.filter((id) => id !== teamId)
                    : [...prev.team_ids, teamId],
            };
        });
    };

    const handleDeleteHistory = async () => {
        setMessage('');
        setError('');

        if (deleteFilters.team_ids.length === 0) {
            setError('Veuillez sélectionner au moins une équipe à supprimer.');
            return;
        }

        const confirmed = window.confirm(
            'Êtes-vous sûr de vouloir supprimer l’historique des équipes sélectionnées ?'
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);

        try {
            const response = await api.delete('/efficiency-histories', {
                data: {
                    team_ids: deleteFilters.team_ids,
                    date_from: deleteFilters.date_from || null,
                    date_to: deleteFilters.date_to || null,
                },
            });

            setMessage(response.data.message || 'Historique supprimé avec succès.');

            setDeleteFilters({
                team_ids: [],
                date_from: '',
                date_to: '',
            });

            loadHistories();
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                'Erreur lors de la suppression de l’historique.'
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Historique des calculs"
                subtitle="Consulter, rechercher et filtrer les calculs d’efficience."
            />

            <AlertMessage type="success" message={message} />
            <AlertMessage type="danger" message={error} />

            {isAdmin && (
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="mb-3 d-flex align-items-center gap-2">
                            <FaTrash className="text-danger" />
                            <span>Suppression de l’historique par équipe</span>
                        </h5>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Sélectionner une ou plusieurs équipes</label>

                                <div
                                    className="border rounded p-3"
                                    style={{ maxHeight: '220px', overflowY: 'auto' }}
                                >
                                    {teams.length > 0 ? (
                                        teams.map((team) => (
                                            <div key={team.id} className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`delete-team-${team.id}`}
                                                    checked={deleteFilters.team_ids.includes(team.id)}
                                                    onChange={() => handleTeamSelection(team.id)}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`delete-team-${team.id}`}
                                                >
                                                    {team.name}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted mb-0">Aucune équipe disponible.</p>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Date début</label>
                                <input
                                    type="date"
                                    name="date_from"
                                    className="form-control"
                                    value={deleteFilters.date_from}
                                    onChange={handleDeleteFilterChange}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Date fin</label>
                                <input
                                    type="date"
                                    name="date_to"
                                    className="form-control"
                                    value={deleteFilters.date_to}
                                    onChange={handleDeleteFilterChange}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn btn-danger d-inline-flex align-items-center gap-2"
                            onClick={handleDeleteHistory}
                            disabled={deleting}
                        >
                            <FaTrash />
                            <span>
                                {deleting ? 'Suppression...' : 'Supprimer l’historique sélectionné'}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-3">
                            <input
                                type="text"
                                name="search"
                                className="form-control"
                                placeholder="Recherche équipe / référence"
                                value={filters.search}
                                onChange={handleChange}
                            />
                        </div>

                        {isAdmin && (
                            <div className="col-md-2">
                                <select
                                    name="team_id"
                                    className="form-select"
                                    value={filters.team_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Toutes les équipes</option>
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="col-md-2">
                            <select
                                name="status"
                                className="form-select"
                                value={filters.status}
                                onChange={handleChange}
                            >
                                <option value="">Tous les statuts</option>
                                <option value="above_target">Au-dessus</option>
                                <option value="below_target">En-dessous</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <input
                                type="date"
                                name="date_from"
                                className="form-control"
                                value={filters.date_from}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-2">
                            <input
                                type="date"
                                name="date_to"
                                className="form-control"
                                value={filters.date_to}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-1">
                            <button
                                type="submit"
                                className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2"
                            >
                                <FaSearch />
                                <span className="d-none d-md-inline">OK</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    {loading ? (
                        <LoaderOverlay text="Chargement de l’historique..." />
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Équipe</th>
                                        <th>Références</th>
                                        <th>Opérateurs</th>
                                        <th>Temps gamme</th>
                                        <th>Quantité</th>
                                        <th>Temps travail</th>
                                        <th>Date</th>
                                        <th>Efficience</th>
                                        <th>Objectif</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {histories.length > 0 ? (
                                        histories.map((history) => (
                                            <tr key={history.id}>
                                                <td>{history.team?.name}</td>
                                                <td>{(history.reference_codes || []).join(', ')}</td>
                                                <td>{history.operator_count}</td>
                                                <td>{history.total_gamme_time}</td>
                                                <td>{history.quantity_total}</td>
                                                <td>{history.work_time}</td>
                                                <td>{formatDateTime(history.calculation_date)}</td>
                                                <td>{formatPercent(history.efficiency_value)}</td>
                                                <td>{formatPercent(history.objective)}</td>
                                                <td>
                                                    <StatBadge status={history.status} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center">
                                                <EmptyState
                                                    title="Aucun historique trouvé"
                                                    description="Essayez de modifier les filtres de recherche."
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {pagination && pagination.last_page > 1 && (
                        <div className="d-flex gap-2 mt-3">
                            {Array.from({ length: pagination.last_page }).map((_, index) => (
                                <button
                                    key={index + 1}
                                    className={`btn btn-sm ${
                                        pagination.current_page === index + 1
                                            ? 'btn-primary'
                                            : 'btn-outline-primary'
                                    }`}
                                    onClick={() => loadHistories(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}