import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Compass, User, Settings, LogOut } from "lucide-react";
import logoDark  from "../assets/images/LogoSideBarDark.svg";
import logoLight from "../assets/images/LogoSideBarLight.svg";
import cardDark  from "../assets/images/CardNewTools.svg";
import cardLight from "../assets/images/CardNewToolsLight.svg";

export default function ClientSidebar({ variant = "dark" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark   = variant === "dark";

  const sidebarBg     = isDark ? "#1E1610"                     : "#F7F3EF";
  const activeBg      = isDark ? "rgba(255,255,255,0.10)"      : "rgba(201,144,42,0.12)";
  const activeColor   = isDark ? "#FFFFFF"                     : "#2C221A";
  const inactiveColor = isDark ? "rgba(255,255,255,0.50)"      : "rgba(44,34,26,0.45)";
  const activeBorder  = isDark ? "rgba(109, 74, 32, 0.6)"       : "#7A6A5A";
  const hoverBg       = isDark ? "rgba(255,255,255,0.05)"      : "rgba(201,144,42,0.07)";
  const logoutColor   = isDark ? "rgba(255,255,255,0.35)"      : "rgba(44,34,26,0.35)";
  const borderRight   = isDark ? "none"                        : "1px solid #E2D8CE";
  const boxShadow     = isDark ? "4px 0 24px rgba(0,0,0,0.35)": "6px 0 24px rgba(140,123,107,0.10)";

  const logo = isDark ? logoDark  : logoLight;
  const card = isDark ? cardDark  : cardLight;

  const navItems = [
    { icon: <LayoutDashboard size={18} strokeWidth={1.5} />, label: "Dashboard",         path: "/dashboard" },
    { icon: <Compass         size={18} strokeWidth={1.5} />, label: "Explore Designers", path: "/designers" },
    { icon: <User            size={18} strokeWidth={1.5} />, label: "My Profile",         path: "/profile" },
    { icon: <Settings        size={18} strokeWidth={1.5} />, label: "Settings",           path: "/settings" },
  ];

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: sidebarBg,
      borderRight, boxShadow,
      display: "flex", flexDirection: "column",
      justifyContent: "space-between",
      height: "100vh",
      padding: "36px 0",
    }}>

      {/* Top: Logo + Nav */}
      <div>
        <div style={{ padding: "0 20px 48px", display: "flex", justifyContent: "center" }}>
          <img src={logo} alt="Swagne" style={{ width: 88, height: 88, objectFit: "contain" }} />
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 12px" }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = hoverBg; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "13px 16px",
                  borderRadius: 10,
                  background: isActive ? activeBg : "transparent",
                  border: "none",
                  borderLeft: isActive ? `2px solid ${activeBorder}` : "2px solid transparent",
                  cursor: "pointer",
                  color: isActive ? activeColor : inactiveColor,
                  fontSize: 13, fontFamily: "'Jost', sans-serif",
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: "0.02em", textAlign: "left",
                  transition: "background 0.15s",
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Card + Logout */}
      <div>
        <div style={{ padding: "0 14px 16px" }}>
          <img src={card} alt="New tools coming" style={{ width: "100%", borderRadius: 12 }} />
        </div>

        <button
          onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); }}
          onMouseEnter={e => e.currentTarget.style.background = hoverBg}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "11px 20px", background: "transparent", border: "none",
            cursor: "pointer", color: logoutColor,
            fontSize: 13, fontFamily: "'Jost', sans-serif",
            textAlign: "left", transition: "background 0.15s",
          }}
        >
          <LogOut size={16} strokeWidth={1.5} />
          Log Out
        </button>
      </div>
    </aside>
  );
}