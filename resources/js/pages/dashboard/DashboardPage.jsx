import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import PageHeader from '../../components/common/PageHeader';
import EfficiencyTrendChart from '../../components/dashboard/EfficiencyTrendChart';
import KpiCard from '../../components/dashboard/KpiCard';
import RecentHistoryTable from '../../components/dashboard/RecentHistoryTable';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedCard from '../../components/common/AnimatedCard';
import PageWrapper from '../../components/common/PageWrapper';

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

  /*  return (
        <div>
            <PageHeader
                title="Dashboard"
                subtitle={
                    isAdmin
                        ? 'Vue globale de performance de toutes les équipes.'
                        : `Vue de performance de votre équipe${user?.team?.name ? ` — ${user.team.name}` : ''}.`
                }
            />

            <AlertMessage type="danger" message={error} />

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <>
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <KpiCard
                                title="Total calculs"
                                value={summary?.total_calculations ?? 0}
                                subtitle="Nombre total de calculs"
                            />
                        </div>

                        <div className="col-md-3">
                            <KpiCard
                                title="Moyenne efficience"
                                value={`${summary?.average_efficiency ?? 0}%`}
                                subtitle="Performance moyenne"
                            />
                        </div>

                        <div className="col-md-3">
                            <KpiCard
                                title="Meilleure efficience"
                                value={`${summary?.best_efficiency ?? 0}%`}
                                subtitle="Valeur maximale"
                            />
                        </div>

                        <div className="col-md-3">
                            <KpiCard
                                title="Plus faible efficience"
                                value={`${summary?.lowest_efficiency ?? 0}%`}
                                subtitle="Valeur minimale"
                            />
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-12">
                            <EfficiencyTrendChart
                                data={trendData}
                                title={
                                    isAdmin
                                        ? 'Évolution globale de l’efficience'
                                        : 'Évolution de l’efficience de votre équipe'
                                }
                            />
                        </div>
                    </div>

                    <RecentHistoryTable rows={recentHistory} />
                </>
            )}
        </div>
    );*/
    return (
        <PageWrapper>
            <div>
                <PageHeader
                    title="Dashboard"
                    subtitle={
                        isAdmin
                            ? 'Vue globale de performance de toutes les équipes.'
                            : `Vue de performance de votre équipe${user?.team?.name ? ` — ${user.team.name}` : ''}.`
                    }
                />

                <AlertMessage type="danger" message={error} />

                {loading ? (
                    <p>Chargement...</p>
                ) : (
                    <>
                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <AnimatedCard delay={0.05}>
                                    <KpiCard
                                        title="Total calculs"
                                        value={summary?.total_calculations ?? 0}
                                        subtitle="Nombre total de calculs"
                                        accent="primary"
                                    />
                                </AnimatedCard>
                            </div>

                            <div className="col-md-3">
                                <AnimatedCard delay={0.1}>
                                    <KpiCard
                                        title="Moyenne efficience"
                                        value={`${summary?.average_efficiency ?? 0}%`}
                                        subtitle="Performance moyenne"
                                        accent="success"
                                    />
                                </AnimatedCard>
                            </div>

                            <div className="col-md-3">
                                <AnimatedCard delay={0.15}>
                                    <KpiCard
                                        title="Meilleure efficience"
                                        value={`${summary?.best_efficiency ?? 0}%`}
                                        subtitle="Valeur maximale"
                                        accent="warning"
                                    />
                                </AnimatedCard>
                            </div>

                            <div className="col-md-3">
                                <AnimatedCard delay={0.2}>
                                    <KpiCard
                                        title="Plus faible efficience"
                                        value={`${summary?.lowest_efficiency ?? 0}%`}
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