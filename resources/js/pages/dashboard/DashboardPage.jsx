import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import LoaderOverlay from '../../components/common/LoaderOverlay';
import AnimatedCard from '../../components/common/AnimatedCard';
import PageWrapper from '../../components/common/PageWrapper';
import EfficiencyTrendChart from '../../components/dashboard/EfficiencyTrendChart';
import KpiCard from '../../components/dashboard/KpiCard';
import RecentHistoryTable from '../../components/dashboard/RecentHistoryTable';
import { useAuth } from '../../contexts/AuthContext';
import { formatPercent } from '../../utils/formatters';

export default function DashboardPage() {
    const { isAdmin, user } = useAuth();

    const [globalStats, setGlobalStats] = useState(null);
    const [teamStats, setTeamStats] = useState(null);
    const [recentHistory, setRecentHistory] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);
            setError('');

            try {
                const historyResponse = await api.get('/efficiency-histories', {
                    params: { page: 1 },
                });

                setRecentHistory(historyResponse.data.data || []);

                if (isAdmin) {
                    const statsResponse = await api.get('/statistics/global');
                    setGlobalStats(statsResponse.data);
                } else if (user?.team?.id) {
                    const statsResponse = await api.get(`/statistics/teams/${user.team.id}`);
                    setTeamStats(statsResponse.data);
                }
            } catch (err) {
                setError('Erreur lors du chargement du dashboard.');
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [isAdmin, user]);

    const summary = isAdmin ? globalStats?.summary : teamStats?.summary;

    const trendData = isAdmin
        ? globalStats?.charts?.global_trend || []
        : teamStats?.charts?.efficiency_trend || [];

    return (
        <PageWrapper>
            <div>
                <div className="page-hero">
                    <div className="soft-panel">
                        <h1 className="page-section-title">Dashboard</h1>
                        <p className="page-section-subtitle">
                            {isAdmin
                                ? 'Vue globale de performance de toutes les équipes.'
                                : `Vue de performance de votre équipe${user?.team?.name ? ` — ${user.team.name}` : ''}.`}
                        </p>
                    </div>
                </div>

                <AlertMessage type="danger" message={error} />

                {loading ? (
                    <LoaderOverlay text="Chargement du dashboard..." />
                ) : (
                    <>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-3">
                                <AnimatedCard delay={0.05}>
                                    <KpiCard
                                        title="Total calculs"
                                        value={summary?.total_calculations ?? 0}
                                        subtitle="Nombre total de calculs"
                                        accent="primary"
                                    />
                                </AnimatedCard>
                            </div>

                            <div className="col-md-6 col-xl-3">
                                <AnimatedCard delay={0.1}>
                                    <KpiCard
                                        title="Moyenne efficience"
                                        value={formatPercent(summary?.average_efficiency ?? 0)}
                                        subtitle="Performance moyenne"
                                        accent="success"
                                    />
                                </AnimatedCard>
                            </div>

                            <div className="col-md-6 col-xl-3">
                                <AnimatedCard delay={0.15}>
                                    <KpiCard
                                        title="Meilleure efficience"
                                        value={formatPercent(summary?.best_efficiency ?? 0)}
                                        subtitle="Valeur maximale"
                                        accent="warning"
                                    />
                                </AnimatedCard>
                            </div>

                            <div className="col-md-6 col-xl-3">
                                <AnimatedCard delay={0.2}>
                                    <KpiCard
                                        title="Plus faible efficience"
                                        value={formatPercent(summary?.lowest_efficiency ?? 0)}
                                        subtitle="Valeur minimale"
                                        accent="danger"
                                    />
                                </AnimatedCard>
                            </div>
                        </div>

                        <div className="row g-4 mb-4">
                            <div className="col-12">
                                <AnimatedCard delay={0.25}>
                                    <EfficiencyTrendChart
                                        data={trendData}
                                        title={
                                            isAdmin
                                                ? 'Évolution globale de l’efficience'
                                                : 'Évolution de l’efficience de votre équipe'
                                        }
                                    />
                                </AnimatedCard>
                            </div>
                        </div>

                        <AnimatedCard delay={0.3}>
                            <RecentHistoryTable rows={recentHistory} />
                        </AnimatedCard>
                    </>
                )}
            </div>
        </PageWrapper>
    );
}