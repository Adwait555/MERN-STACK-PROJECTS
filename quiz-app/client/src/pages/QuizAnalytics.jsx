import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function QuizAnalytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/quizzes/${id}/analytics`).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <div className="container"><p style={{ color: '#fff' }}>Loading…</p></div>;

  return (
    <div className="container">
      <h2 className="heading" style={{ color: '#fff', fontSize: 24, marginBottom: 16 }}>Quiz analytics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="card">
          <p className="muted" style={{ fontSize: 13, margin: '0 0 4px' }}>Attempts</p>
          <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{data.attemptsCount}</p>
        </div>
        <div className="card">
          <p className="muted" style={{ fontSize: 13, margin: '0 0 4px' }}>Average score</p>
          <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{data.averagePercentage}%</p>
        </div>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', padding: '6px 4px' }}>Student</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', padding: '6px 4px' }}>Score</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', padding: '6px 4px' }}>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>{r.student}</td>
                <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>{r.score}/{r.total} ({r.percentage}%)</td>
                <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border)' }} className="muted">{new Date(r.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
