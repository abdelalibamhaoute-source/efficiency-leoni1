import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import LoaderOverlay from '../../components/common/LoaderOverlay';
import { formatPercent } from '../../utils/formatters';
import { Cell } from 'recharts';
import PageWrapper from '../../components/common/PageWrapper';
import AnimatedCard from '../../components/common/AnimatedCard';



export default function StatisticsPage() {
    const { isAdmin, user } = useAuth();

    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [teamStats, setTeamStats] = useState(null);
    const [globalStats, setGlobalStats] = useState(null);
    const [comparisonStats, setComparisonStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadTeams = async () => {
        if (!isAdmin) {
            if (user?.team?.id) {
                setSelectedTeam(String(user.team.id));
            }
            return;
        }

        try {
            const response = await api.get('/teams');
            const loadedTeams = response.data.data || [];
            setTeams(loadedTeams);

            if (loadedTeams.length > 0 && !selectedTeam) {
                setSelectedTeam(String(loadedTeams[0].id));
            }
        } catch (err) {
            setError('Erreur lors du chargement des équipes.');
        }
    };

    const loadStatistics = async (teamIdParam = selectedTeam) => {
        setLoading(true);
        setError('');

        try {
            const params = {
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            };

            const [globalResponse, comparisonResponse] = await Promise.all([
                api.get('/statistics/global', { params }),
                api.get('/statistics/teams-comparison', { params }),
            ]);

            setGlobalStats(globalResponse.data);
            setComparisonStats(comparisonResponse.data.comparison || []);

            if (teamIdParam) {
                const teamResponse = await api.get(`/statistics/teams/${teamIdParam}`, {
                    params,
                });
                setTeamStats(teamResponse.data);
            } else {
                setTeamStats(null);
            }
        } catch (err) {
            setError('Erreur lors du chargement des statistiques.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        if ((!isAdmin && user?.team?.id) || (isAdmin && selectedTeam)) {
            loadStatistics(!isAdmin ? user?.team?.id : selectedTeam);
        }
    }, [isAdmin, user, selectedTeam]);

    const handleSubmit = (event) => {
        event.preventDefault();
        loadStatistics(!isAdmin ? user?.team?.id : selectedTeam);
    };

    return (
        <PageWrapper>
            <div>
                <PageHeader
                    title="Statistiques"
                    subtitle="Consulter les statistiques par équipe et globales."
                />

                <AlertMessage type="danger" message={error} />

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                        <form className="row g-3" onSubmit={handleSubmit}>
                            {isAdmin && (
                                <div className="col-md-4">
                                    <label className="form-label">Équipe</label>
                                    <select
                                        className="form-select"
                                        value={selectedTeam}
                                        onChange={(e) => setSelectedTeam(e.target.value)}
                                    >
                                        <option value="">Choisir une équipe</option>
                                        {teams.map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="col-md-3">
                                <label className="form-label">Date début</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Date fin</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>

                            <div className="col-md-2 d-flex align-items-end">
                                <button type="submit" className="btn btn-dark w-100">
                                    Afficher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {loading ? (
                <LoaderOverlay text="Chargement des statistiques..." />
                ) : (
                    <>
                        {globalStats?.summary && (
                            <div className="row g-3 mb-4">
                                <div className="col-md-3">
                                    <AnimatedCard delay={0.05}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <h6>Total calculs</h6>
                                            <div className="fs-4 fw-bold">
                                                {globalStats.summary.total_calculations}
                                            </div>
                                        </div>
                                    </div>
                                    </AnimatedCard>
                                </div>

                                <div className="col-md-3">
                                    <AnimatedCard delay={0.1}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <h6>Moyenne efficience</h6>
                                            <div className="fs-4 fw-bold">
                                                {formatPercent(globalStats.summary.average_efficiency)}
                                            </div>
                                        </div>
                                    </div>
                                    </AnimatedCard>
                                </div>

                                <div className="col-md-3">
                                    <AnimatedCard delay={0.15}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <h6>Meilleure efficience</h6>
                                            <div className="fs-4 fw-bold">
                                                {formatPercent(globalStats.summary.best_efficiency)}
                                            </div>
                                        </div>
                                    </div>
                                    </AnimatedCard>
                                </div>

                                <div className="col-md-3">
                                    <AnimatedCard delay={0.2}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            <h6>Plus faible efficience</h6>
                                            <div className="fs-4 fw-bold">
                                                {formatPercent(globalStats.summary.lowest_efficiency)}
                                            </div>
                                        </div>
                                    </div>
                                    </AnimatedCard>
                                </div>
                            </div>
                        )}

                        <div className="row g-4">
                            <div className="col-lg-6">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="mb-3">Évolution globale</h5>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={globalStats?.charts?.global_trend || []}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                type="monotone"
                                                    dataKey="efficiency"
                                                    name="Efficience"
                                                    stroke="#0d6efd"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="objective"
                                                    name="Objectif"
                                                    stroke="#6c757d"
                                                    strokeDasharray="5 5"
                                                />
                                                
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="mb-3">Comparaison équipes</h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={comparisonStats}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="team_name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />

                                            {/* Efficiency */}
                                            <Bar dataKey="average_efficiency" name="Efficience moyenne">
                                                {comparisonStats.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            entry.average_efficiency >= entry.average_objective
                                                                ? '#28a745' // green
                                                                : '#dc3545' // red
                                                        }
                                                    />
                                                ))}
                                            </Bar>

                                            {/* Objective */}
                                            <Bar dataKey="average_objective" name="Objectif moyen" fill="#9da8a8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {teamStats && (
                                <>
                                    <div className="col-lg-6">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body">
                                                <h5 className="mb-3">
                                                    Évolution équipe — {teamStats.team?.name}
                                                </h5>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <LineChart data={teamStats?.charts?.efficiency_trend || []}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="date" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="efficiency"
                                                            name="Efficience"
                                                            stroke="#0d6efd"
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="objective"
                                                            name="Objectif"
                                                            stroke="#0c0c0b"
                                                            strokeDasharray="5 5"
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body">
                                                <h5 className="mb-3">Top références</h5>
                                                <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={teamStats?.charts?.top_references || []}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="code" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />

                                                    <Bar dataKey="total_quantity" name="Quantité totale">
                                                        {(teamStats?.charts?.top_references || []).map((entry, index, array) => {
                                                            const average =
                                                                array.reduce((sum, item) => sum + Number(item.total_quantity || 0), 0) /
                                                                (array.length || 1);

                                                            return (
                                                                <Cell
                                                                    key={`qty-cell-${index}`}
                                                                    fill={
                                                                        Number(entry.total_quantity) >= average
                                                                            ? '#28a745' // vert
                                                                            : '#dc3545' // rouge
                                                                    }
                                                                />
                                                            );
                                                        })}
                                                    </Bar>

                                                    <Bar dataKey="usage_count" name="Utilisations" fill="#6c757d" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                            </>
                        )}
                    </div>
                </>
             )}
            </div>
        </PageWrapper>
    );
}