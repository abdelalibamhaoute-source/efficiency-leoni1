import React, { useEffect, useMemo, useState } from 'react';
import { FaCalculator, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../contexts/AuthContext';

export default function EfficiencyCalculationPage() {
    const { user, isAdmin, isShiftLeader } = useAuth();

    const [teams, setTeams] = useState([]);
    const [referenceSearch, setReferenceSearch] = useState('');
    const [referenceOptions, setReferenceOptions] = useState([]);
    const [selectedReferences, setSelectedReferences] = useState([]);

    const [form, setForm] = useState({
        team_id: '',
        objective: '',
        operator_count: '',
        work_time: '',
        calculation_date: '',
    });

    const [result, setResult] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [loadingReferences, setLoadingReferences] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoadingTeams(true);
            setError('');

            try {
                if (isAdmin) {
                    const response = await api.get('/teams');
                    const loadedTeams = response.data.data || [];

                    setTeams(loadedTeams);

                    if (loadedTeams.length > 0) {
                        setForm((prev) => ({
                            ...prev,
                            team_id: prev.team_id || String(loadedTeams[0].id),
                        }));
                    }
                } else if (isShiftLeader && user?.team) {
                    setTeams([user.team]);
                    setForm((prev) => ({
                        ...prev,
                        team_id: String(user.team.id),
                    }));
                }
            } catch (err) {
                setError('Erreur lors du chargement des équipes.');
            } finally {
                setLoadingTeams(false);
            }
        };

        loadInitialData();
    }, [isAdmin, isShiftLeader, user]);

    useEffect(() => {
        const fetchReferences = async () => {
            setLoadingReferences(true);

            try {
                const response = await api.get('/reference-options', {
                    params: { search: referenceSearch },
                });

                setReferenceOptions(response.data.references || []);
            } catch (err) {
                setError('Erreur lors du chargement des références.');
            } finally {
                setLoadingReferences(false);
            }
        };

        fetchReferences();
    }, [referenceSearch]);

    const totalGammeTime = useMemo(() => {
        return selectedReferences
            .reduce((sum, item) => {
                const qty = Number(item.quantity || 0);
                const tg = Number(item.gamme_time || 0);
                return sum + qty * tg;
            }, 0)
            .toFixed(2);
    }, [selectedReferences]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddReference = (reference) => {
        const alreadyExists = selectedReferences.some(
            (item) => item.product_reference_id === reference.id
        );

        if (alreadyExists) {
            return;
        }

        setSelectedReferences((prev) => [
            ...prev,
            {
                product_reference_id: reference.id,
                code: reference.code,
                gamme_time: Number(reference.gamme_time),
                quantity: '',
            },
        ]);
    };

    const handleReferenceQuantityChange = (referenceId, value) => {
        setSelectedReferences((prev) =>
            prev.map((item) =>
                item.product_reference_id === referenceId
                    ? { ...item, quantity: value }
                    : item
            )
        );
    };

    const handleRemoveReference = (referenceId) => {
        setSelectedReferences((prev) =>
            prev.filter((item) => item.product_reference_id !== referenceId)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage('');
        setError('');
        setResult(null);

        if (!form.team_id || form.team_id === '') {
            setError('Veuillez sélectionner une équipe.');
            setSubmitting(false);
            return;
        }

        if (selectedReferences.length === 0) {
            setError('Veuillez sélectionner au moins une référence.');
            setSubmitting(false);
            return;
        }

        const hasInvalidQuantity = selectedReferences.some(
            (item) => !item.quantity || Number(item.quantity) <= 0
        );

        if (hasInvalidQuantity) {
            setError('Veuillez saisir une quantité valide pour chaque référence.');
            setSubmitting(false);
            return;
        }

        try {
            const payload = {
                team_id: parseInt(form.team_id, 10),
                objective: Number(form.objective),
                operator_count: Number(form.operator_count),
                work_time: Number(form.work_time),
                calculation_date: form.calculation_date || null,
                references: selectedReferences.map((item) => ({
                    product_reference_id: item.product_reference_id,
                    quantity: Number(item.quantity),
                })),
            };

            const response = await api.post('/efficiency-calculations', payload);

            setResult(response.data.result);
            setMessage(response.data.message || 'Calcul effectué avec succès.');
            setSelectedReferences([]);
        } catch (err) {
            if (err?.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0];
                setError(Array.isArray(firstError) ? firstError[0] : 'Erreur de validation.');
            } else {
                setError(err?.response?.data?.message || 'Erreur lors du calcul.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Calculer l’efficience"
                subtitle="Sélectionner l’équipe, les références et les quantités pour lancer le calcul."
            />

            <AlertMessage type="success" message={message} />
            <AlertMessage type="danger" message={error} />

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Objectif</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            name="objective"
                                            className="form-control"
                                            value={form.objective}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Équipe</label>
                                        <select
                                            name="team_id"
                                            className="form-select"
                                            value={form.team_id}
                                            onChange={handleChange}
                                            required
                                            disabled={(!isAdmin && !isShiftLeader) || loadingTeams}
                                        >
                                            <option value="">Choisir une équipe</option>
                                            {teams.map((team) => (
                                                <option key={team.id} value={String(team.id)}>
                                                    {team.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Nombre d’opérateurs</label>
                                        <input
                                            type="number"
                                            min="1"
                                            name="operator_count"
                                            className="form-control"
                                            value={form.operator_count}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Temps de travail</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            name="work_time"
                                            className="form-control"
                                            value={form.work_time}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Date de calcul</label>
                                        <input
                                            type="datetime-local"
                                            name="calculation_date"
                                            className="form-control"
                                            value={form.calculation_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Temps gamme total</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={totalGammeTime}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div className="mb-3">
                                    <label className="form-label">Recherche référence</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaSearch />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Chercher par code ou 4 derniers chiffres"
                                            value={referenceSearch}
                                            onChange={(e) => setReferenceSearch(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div
                                    className="border rounded p-3 mb-3"
                                    style={{ maxHeight: '220px', overflowY: 'auto' }}
                                >
                                    {loadingReferences ? (
                                        <p className="mb-0">Chargement...</p>
                                    ) : referenceOptions.length > 0 ? (
                                        referenceOptions.map((reference) => (
                                            <div
                                                key={reference.id}
                                                className="d-flex justify-content-between align-items-center border-bottom py-2"
                                            >
                                                <div>
                                                    <div className="fw-semibold">{reference.code}</div>
                                                    <small className="text-muted">
                                                        TG: {reference.gamme_time}
                                                    </small>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2"
                                                    onClick={() => handleAddReference(reference)}
                                                >
                                                    <FaPlus />
                                                    <span className="d-none d-md-inline">Ajouter</span>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="mb-0">Aucune référence trouvée.</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h5>Références sélectionnées</h5>

                                    {selectedReferences.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-bordered align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Code</th>
                                                        <th>Temps gamme</th>
                                                        <th>Quantité</th>
                                                        <th>Sous-total</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedReferences.map((item) => (
                                                        <tr key={item.product_reference_id}>
                                                            <td>{item.code}</td>
                                                            <td>{item.gamme_time}</td>
                                                            <td style={{ width: '160px' }}>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    className="form-control"
                                                                    value={item.quantity}
                                                                    onChange={(e) =>
                                                                        handleReferenceQuantityChange(
                                                                            item.product_reference_id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    required
                                                                />
                                                            </td>
                                                            <td>
                                                                {(
                                                                    Number(item.quantity || 0) *
                                                                    Number(item.gamme_time || 0)
                                                                ).toFixed(2)}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm d-inline-flex align-items-center gap-2"
                                                                    onClick={() =>
                                                                        handleRemoveReference(item.product_reference_id)
                                                                    }
                                                                >
                                                                    <FaTrash />
                                                                    <span className="d-none d-md-inline">Supprimer</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-muted">Aucune référence sélectionnée.</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary d-inline-flex align-items-center gap-2"
                                    disabled={submitting || selectedReferences.length === 0}
                                >
                                    <FaCalculator />
                                    <span>{submitting ? 'Calcul en cours...' : 'Calculer'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-3">Résultat</h5>

                            {result ? (
                                <div className="d-flex flex-column gap-2">
                                    <div><strong>Équipe :</strong> {result.team?.name}</div>
                                    <div><strong>Efficience :</strong> {result.efficiency_value}%</div>
                                    <div><strong>Objectif :</strong> {result.objective}%</div>
                                    <div>
                                        <strong>Statut :</strong>{' '}
                                        <span className={`badge ${result.status === 'above_target' ? 'bg-success' : 'bg-danger'}`}>
                                            {result.status === 'above_target'
                                                ? 'Au-dessus de l’objectif'
                                                : 'En-dessous de l’objectif'}
                                        </span>
                                    </div>
                                    <div><strong>Temps gamme total :</strong> {result.total_gamme_time}</div>
                                    <div><strong>Quantité totale :</strong> {result.quantity_total}</div>
                                </div>
                            ) : (
                                <div className="empty-state-box">
                                    Aucun calcul effectué pour le moment.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}