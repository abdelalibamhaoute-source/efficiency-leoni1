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

export default function EfficiencyTrendChart({ data = [], title = 'Évolution de l’efficience' }) {
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <h5 className="mb-3">{title}</h5>

                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="efficiency" name="Efficience" strokeWidth={2} />
                        <Line type="monotone" dataKey="objective" name="Objectif" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}