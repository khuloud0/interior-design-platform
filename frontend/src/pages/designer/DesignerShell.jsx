import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Inbox, FolderKanban, Settings, User, LogOut } from 'lucide-react';
import logoLight from '../../assets/images/LogoSideBarLight.svg';

const designerNavItems = [
  { key: 'requests', label: 'Avaliable Request', path: '/designer/dashboard', Icon: Inbox },
  { key: 'manage', label: 'Manage Project', path: '/designer/manage', Icon: FolderKanban },
  { key: 'profile', label: 'Edit Profile', path: '/designer/edit-profile', Icon: User },
  { key: 'settings', label: 'Setting', path: '/designer/settings', Icon: Settings },
];

export function DesignerShell({ active = 'requests', children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const getActiveKey = () => {
    const current = location.pathname;
    if (current === '/designer/settings') return 'settings';
    if (current === '/designer/edit-profile' || current === '/designer/MyProfile' || current === '/designer/profile') return 'profile';
    if (current === '/designer/manage' || current.endsWith('/create-plan')) return 'manage';
    if (current === '/designer/dashboard' || current.startsWith('/designer/requests')) return 'requests';
    return active;
  };

  const activeKey = getActiveKey();

  const goHome = () => {
    setMenuOpen(false);
    navigate('/designer/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="designer-app">
      <header className="mobile-shell-header">
        <button className="mobile-brand" type="button" onClick={goHome} aria-label="Go to profile">
          <img src={logoLight} alt="" />
        </button>
        <button
          className={`mobile-menu-toggle ${menuOpen ? 'is-open' : ''}`}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="designer-mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <aside
        className={`sidebar ${menuOpen ? 'is-open' : ''}`}
        id="designer-mobile-nav"
        aria-label="Designer navigation"
      >
        <button className="brand-mark" type="button" onClick={goHome} aria-label="Go to profile">
          <img src={logoLight} alt="" />
        </button>

        <nav className="side-nav">
          {designerNavItems.map((item) => {
            const Icon = item.Icon;
            return (
              <NavLink
                className={`side-link ${activeKey === item.key ? 'is-active' : ''}`}
                key={item.key}
                to={item.path}
                onClick={() => setMenuOpen(false)}
              >
                <Icon className="nav-icon" size={22} strokeWidth={1.75} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="tools-card">
            <strong>SWAGNE</strong>
            <b>Growing together</b>
            <p>
              <span>New tools and features are on</span>
              <span>the way! to improve your experience</span>
            </p>
          </div>
          <button className="side-link logout" type="button" onClick={handleLogout}>
            <LogOut className="nav-icon" size={22} strokeWidth={1.75} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}

export function StatusPill({ status }) {
  const label = status
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');

  return <span className={`status-pill status-${status}`}>{label}</span>;
}
