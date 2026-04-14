import React from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { FaBullseye, FaChartLine } from 'react-icons/fa';

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const efficiency = payload.find((item) => item.dataKey === 'efficiency');
    const objective = payload.find((item) => item.dataKey === 'objective');

    return (
        <div
            style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                padding: '12px 14px',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
                minWidth: '170px',
            }}
        >
            <div
                style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '8px',
                }}
            >
                {label}
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px',
                    color: '#2563eb',
                    fontWeight: 600,
                }}
            >
                <FaChartLine />
                <span>
                    Efficience : {efficiency?.value ?? 0}%
                </span>
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#f59e0b',
                    fontWeight: 600,
                }}
            >
                <FaBullseye />
                <span>
                    Objectif : {objective?.value ?? 0}%
                </span>
            </div>
        </div>
    );
}

function CustomLegend() {
    return (
        <div className="d-flex justify-content-center flex-wrap gap-4 pt-3">
            <div className="d-flex align-items-center gap-2">
                <span
                    style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        display: 'inline-block',
                    }}
                />
                <span className="text-muted fw-semibold">Efficience</span>
            </div>

            <div className="d-flex align-items-center gap-2">
                <span
                    style={{
                        width: '18px',
                        height: '0',
                        borderTop: '3px dashed #f59e0b',
                        display: 'inline-block',
                    }}
                />
                <span className="text-muted fw-semibold">Objectif</span>
            </div>
        </div>
    );
}

export default function EfficiencyTrendChart({ data = [], title = 'Évolution de l’efficience' }) {
    const hasData = Array.isArray(data) && data.length > 0;

    return (
        <div className="card border-0 shadow-sm chart-card">
            <div className="card-body">
                <h5 className="mb-3">{title}</h5>

                {hasData ? (
                    <ResponsiveContainer width="100%" height={360}>
                        <LineChart
                            data={data}
                            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={{ stroke: '#d1d5db' }}
                                tickLine={{ stroke: '#d1d5db' }}
                            />
                            <YAxis
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={{ stroke: '#d1d5db' }}
                                tickLine={{ stroke: '#d1d5db' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />

                            <Line
                                type="monotone"
                                dataKey="efficiency"
                                name="Efficience"
                                stroke="#2563eb"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
                                activeDot={{ r: 7 }}
                                animationDuration={700}
                            />

                            <Line
                                type="monotone"
                                dataKey="objective"
                                name="Objectif"
                                stroke="#f59e0b"
                                strokeWidth={2.5}
                                strokeDasharray="7 5"
                                dot={{ r: 3, strokeWidth: 2, fill: '#ffffff' }}
                                activeDot={{ r: 6 }}
                                animationDuration={700}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="empty-state-box">
                        Aucun historique disponible pour afficher le graphique.
                    </div>
                )}
            </div>
        </div>
    );
}