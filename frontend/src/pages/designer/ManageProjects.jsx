import { FolderOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { DesignerShell, StatusPill } from './DesignerShell';

const STATUS_LABELS = {
  pending:    'pending',
  in_progress: 'in-progress',
  plan_ready:  'plan-ready',
  completed:   'completed',
  cancelled:   'cancelled',
};

function normalizeProject(p) {
  return {
    id:         String(p.id ?? p.request_id ?? ''),
    clientName: p.client_name || p.clientName || 'Client',
    space:      p.space_type  || p.space      || '—',
    style:      p.preferred_style || p.style  || '—',
    budget:     p.budget != null
      ? `${Number(p.budget).toLocaleString('en-US')} SAR`
      : p.budget_label || '—',
    timeline: p.timeline || p.duration || '—',
    status:   STATUS_LABELS[p.status] || p.status || 'pending',
  };
}

export default function ManageProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res  = await api.get('/design-requests');
        const list = res.data?.design_requests ?? res.data?.requests ?? res.data ?? [];
        if (!ignore) {
          setProjects(
            Array.isArray(list)
              // ✅ نعرض فقط الطلبات المقبولة — نخفي الـ pending
              ? list.filter(p => p.status !== 'pending').map(normalizeProject)
              : []
          );
        }
      } catch {
        if (!ignore) setProjects([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  return (
    <DesignerShell active="manage">
      <section className="projects-page animate-in">
        <header className="page-heading">
          <h1>Manage Projects</h1>
          <p>Track your active projects update design plans, review contractor offers,</p>
          <p>and send curated proposals to your client</p>
        </header>

        <div className="projects-table" role="table" aria-label="Manage projects">
          <div className="project-row project-head" role="row">
            <strong>Client Name</strong>
            <strong>Spaces &amp; Style</strong>
            <strong>Budget</strong>
            <strong>Timeline</strong>
            <strong>Status</strong>
            <strong>Action</strong>
          </div>

          {loading ? (
            <div className="project-row project-state-row" role="row">
              <span>Loading projects…</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="projects-empty-state" role="row">
              <span className="projects-empty-icon" aria-hidden="true">
                <FolderOpen size={30} strokeWidth={1.6} />
              </span>
              <h2>No active projects yet</h2>
              <p>Accepted requests will appear here so you can create plans and manage contractor offers.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div className="project-row" role="row" key={project.id}>
                <span>{project.clientName}</span>
                <span>{project.space} · {project.style}</span>
                <span>{project.budget}</span>
                <span>{project.timeline}</span>
                <StatusPill status={project.status} />
                <button
                  type="button"
                  onClick={() => navigate(`/designer/requests/${project.id}/create-plan`)}
                >
                  View Plan &amp; Offers
                </button>
              </div>
            ))
          )}
        </div>

        <footer className="pagination-bar">
          <span>
            Showing <b>1-{projects.length || 0}</b> from <b>{projects.length || 0}</b> data
          </span>
          <div>
            <button type="button" aria-label="Previous page">‹</button>
            <button className="page-current" type="button">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button" aria-label="Next page">›</button>
          </div>
        </footer>
      </section>
    </DesignerShell>
  );
}