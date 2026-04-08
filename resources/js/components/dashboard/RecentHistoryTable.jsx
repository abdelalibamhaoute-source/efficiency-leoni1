import React from 'react';
import EmptyState from '../common/EmptyState';
import StatBadge from '../common/StatBadge';
import { formatDateTime, formatPercent } from '../../utils/formatters';

export default function RecentHistoryTable({ rows = [] }) {
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <h5 className="mb-3">Historique récent</h5>

                {rows.length === 0 ? (
                    <EmptyState
                        title="Aucun historique"
                        description="Aucun calcul récent n’est disponible."
                    />
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Équipe</th>
                                    <th>Références</th>
                                    <th>Opérateurs</th>
                                    <th>Temps travail</th>
                                    <th>Efficience</th>
                                    <th>Objectif</th>
                                    <th>Statut</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.team?.name || '-'}</td>
                                        <td>{(item.reference_codes || []).join(', ')}</td>
                                        <td>{item.operator_count}</td>
                                        <td>{item.work_time}</td>
                                        <td>{formatPercent(item.efficiency_value)}</td>
                                        <td>{formatPercent(item.objective)}</td>
                                        <td>
                                            <StatBadge status={item.status} />
                                        </td>
                                        <td>{formatDateTime(item.calculation_date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}