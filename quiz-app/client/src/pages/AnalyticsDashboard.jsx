import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../api/axios';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/analytics/me').then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="container"><p style={{ color: '#fff' }}>Loading…</p></div>;

  const trendData = data.trend.map((t, i) => ({
    name: `#${i + 1}`,
    percentage: t.percentage,
    quizTitle: t.quizTitle,
  }));

  return (
    <div className="container">
      <h2 className="heading" style={{ color: '#fff', fontSize: 24, marginBottom: 16 }}>My performance</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="card">
          <p className="muted" style={{ fontSize: 13, margin: '0 0 4px' }}>Overall accuracy</p>
          <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{data.overallAccuracy}%</p>
        </div>
        <div className="card">
          <p className="muted" style={{ fontSize: 13, margin: '0 0 4px' }}>Total attempts</p>
          <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{data.totalAttempts}</p>
        </div>
      </div>

      {trendData.length === 0 ? (
        <div className="card"><p className="muted" style={{ margin: 0 }}>Take a quiz to start seeing your trends.</p></div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, margin: '0 0 12px' }}>Score trend over time</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-soft)" />
                <YAxis domain={[0, 100]} unit="%" stroke="var(--text-soft)" />
                <Tooltip formatter={(v) => `${v}%`} labelFormatter={(_, p) => p?.[0]?.payload?.quizTitle} />
                <Line type="monotone" dataKey="percentage" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--accent)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, margin: '0 0 12px' }}>Accuracy by topic</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.topicBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="topic" stroke="var(--text-soft)" />
                <YAxis domain={[0, 100]} unit="%" stroke="var(--text-soft)" />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="accuracy" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
