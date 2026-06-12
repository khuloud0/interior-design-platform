import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { DesignerShell, StatusPill } from './DesignerShell';

const FALLBACK_DETAILS = {
  id: '1234',
  title: 'Living Room Design',
  requestedOn: 'MAY 20, 2025',
  clientName: 'Ahmed Al Mansour',
  location: 'Riyadh, Saudi Arabia',
  spaceType: 'Living Room',
  spaceSize: '35 - 40 m²',
  startDate: 'June 15, 2025',
  duration: '4 - 6 Weeks',
  style: 'Modern Luxury',
  colors: 'Neutral, Warm Tones',
  budget: '4000 SAR',
  status: 'pending',
  description: [
    'We are looking to redesign our living room to reflect a modern luxury aesthetic with a warm, inviting atmosphere.',
    'We prefer a neutral palette with natural textures, high-quality materials, and subtle accent pieces.',
    'Please share your design concept, mood board, and estimated timeline.',
  ],
};

const detailItems = (d) => [
  ['client', 'Client Name', d.clientName],
  ['pin', 'Location', d.location],
  ['space', 'Space Type', d.spaceType],
  ['size', 'Space Size', d.spaceSize],
  ['calendar', 'Desired Start Date', d.startDate],
  ['clock', 'Project Duration', d.duration],
  ['style', 'Design Style', d.style],
  ['color', 'Color Preference', d.colors],
];

const detailIcons = {
  client: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c.7-3.7 3-5.6 6.5-5.6s5.8 1.9 6.5 5.6" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.5 7-12A7 7 0 0 0 5 9c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  ),
  space: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v14H4z" />
      <path d="M4 12h16M10 5v14" />
    </svg>
  ),
  size: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M12 4v16M4 12h16" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3.2 2" />
    </svg>
  ),
  style: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" />
      <path d="M8 6v12M16 6v12" />
    </svg>
  ),
  color: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  ),
};

function normalizeRequest(r) {
  return {
    id: String(r.id ?? r.request_id ?? ''),
    title: r.title || r.space_type || 'Design Request',
    requestedOn: r.created_at || r.submitted_at
      ? new Date(r.created_at || r.submitted_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
        })
      : '—',
    clientName: r.client_name || 'Client',
    location: [r.city, r.country].filter(Boolean).join(', ') || '—',
    spaceType: r.space_type || '—',
    spaceSize: r.space_size ? String(r.space_size) : r.area ? String(r.area) : '—',
    startDate: r.start_date || r.desired_start_date || r.desired_start || '—',
    duration: r.duration || r.timeline || '—',
    style: r.preferred_style || r.style || '—',
    colors: r.color_preference || r.colors || r.preferred_colors || '—',
    budget: r.budget != null ? `${Number(r.budget).toLocaleString('en-US')} SAR` : '—',
    description: Array.isArray(r.description) && r.description.length
      ? r.description
      : [r.notes || r.space_details || 'No additional description provided.'],
    status: r.status ?? 'pending',
  };
}

export default function RequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [details, setDetails] = useState(FALLBACK_DETAILS);
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!id) { setLoading(false); return; }
      try {
        const res = await api.get(`/design-requests/${id}`);
        if (!ignore && res.data) {
          const requestData = res.data.request || res.data;
          setDetails(normalizeRequest(requestData));
        }
      } catch (err) {
        console.error('API error:', err);
        if (!ignore) setDetails({ ...FALLBACK_DETAILS, id });
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id]);

  const handleAccept = async () => {
    setActing(true);
    setActionError('');
    const requestId = id ?? details.id;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      await api.post(`/design-requests/${requestId}/accept`, { designer_id: user.id });
    } catch {
      localStorage.setItem(`accepted_request_${requestId}`, 'in_progress');
      setActionError('Accepted locally. Backend was not available.');
    } finally {
      setActing(false);
      window.setTimeout(() => navigate('/designer/manage'), 350);
    }
  };

  const items = detailItems(details);

  return (
    <DesignerShell active="requests">
      <section className="request-page animate-in">
        <button className="back-link" type="button" onClick={() => navigate('/designer/requests')}>
          <span aria-hidden="true">←</span> Back to Requests
        </button>
        <header className="request-heading">
          <h1>Request #{details.id}: {details.title}</h1>
          <p>REQUESTED ON {details.requestedOn.toUpperCase ? details.requestedOn.toUpperCase() : details.requestedOn}</p>
        </header>
        <div className="request-layout">
          <div className="request-content">
            <section className="detail-card">
              <h2>Request Details</h2>
              <div className="detail-grid">
                {items.map(([icon, label, value]) => (
                  <div className="detail-cell" key={label}>
                    <span className="detail-icon" aria-hidden="true">{detailIcons[icon]}</span>
                    <div>
                      <strong>{label}</strong>
                      <p>{loading ? '…' : value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="description-block">
              <h2>Space Description</h2>
              {details.description.map((paragraph, i) => (
                <p key={`${i}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
              ))}
            </section>
          </div>
          <aside className="summary-card">
            <h2>Request Summary</h2>
            <div className="summary-line" />
            <span>Client Budget</span>
            <strong>{details.budget}</strong>
            <div className="summary-line" />
            <span>Status</span>
            <StatusPill status={details.status} />
            <div className="summary-line" />
            {actionError && <p className="request-action-message">{actionError}</p>}
            <button className="accept-button" type="button" disabled={acting} onClick={handleAccept}>
              <span aria-hidden="true">✓</span> {acting ? 'Processing...' : 'Accept Request'}
            </button>
            <button className="reject-button" type="button" onClick={() => navigate('/designer/requests')}>
              Reject Request
            </button>
          </aside>
        </div>
      </section>
    </DesignerShell>
  );
}