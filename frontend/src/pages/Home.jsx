import React from "react";
import { User, Search, ClipboardList, Box, CheckCircle, Sofa, Scissors, Package } from "lucide-react";
import heroImg from "../assets/images/HeroBackground.svg";
import logo from "../assets/images/Logo130_27.svg";

export default function HomePage() {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");

  const getDashboardPath = () => {
    if (user.role === "designer") return "/designer/dashboard";
    if (user.role === "provider") return "/provider/offers";
    return "/dashboard";
  };

  const c = {
    bg: "#F7F3EE", card: "#FFFFFF", sand: "#D4C4B0",
    stone: "#8C7B6B", dark: "#3D3128", border: "#E0D5C8",
    muted: "#6B6259",
  };
  const steps = [
    { n: "01", icon: <User size={20} strokeWidth={1.5} />, title: "CREATE YOUR PROFILE", desc: "Sign up and tell us about your project or business needs." },
    { n: "02", icon: <Search size={20} strokeWidth={1.5} />, title: "DISCOVER & CONNECT", desc: "Explore curated designers, providers, and products tailored to you." },
    { n: "03", icon: <ClipboardList size={20} strokeWidth={1.5} />, title: "COLLABORATE", desc: "Communicate, share ideas, and refine your vision seamlessly." },
    { n: "04", icon: <Box size={20} strokeWidth={1.5} />, title: "SOURCE & MANAGE", desc: "Access quality products and manage orders, timelines, and deliverables." },
    { n: "05", icon: <CheckCircle size={20} strokeWidth={1.5} />, title: "BRING YOUR VISION TO LIFE", desc: "See your space come together beautifully, on time and on budget." },
  ];
  const roles = [
    { icon: <Sofa size={28} strokeWidth={1.5} color={c.dark} />, title: "CLIENTS", desc: "Find the perfect designer and products to bring your dream space to life." },
    { icon: <Scissors size={28} strokeWidth={1.5} color={c.dark} />, title: "DESIGNERS", desc: "Grow your business, manage projects, and source with ease." },
    { icon: <Package size={28} strokeWidth={1.5} color={c.dark} />, title: "PROVIDERS", desc: "Showcase your products and connect with the right opportunities." },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        html { scroll-behavior: smooth; }
        .btn-get-started { transition: background 0.2s, color 0.2s, transform 0.15s; }
        .btn-get-started:hover { background: #3D3128 !important; color: #F7F3EE !important; transform: translateY(-1px); }
        .btn-cta:hover { background: rgba(212,196,176,0.15) !important; border-color: rgba(255,255,255,0.7) !important; transform: translateY(-1px); }
        .btn-cta { transition: background 0.2s, border-color 0.2s, transform 0.15s; }
      `}</style>

      <div style={{ fontFamily: "'Jost', sans-serif", color: c.dark, background: c.bg, minWidth: "1280px" }}>

        {/* NAVBAR */}
        <nav style={{
          background: c.card, borderBottom: `1px solid ${c.border}`,
          padding: "0 48px", height: "60px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src={logo} alt="Swagne" style={{ height: "27px" }} />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            {[
              { label: "HOME", href: "/" },
              { label: "HOW IT WORKS", href: "#how-it-works" },
              { label: "SERVICES", href: "#services" },
            ].map((l, i) => (
              <a key={i} href={l.href}
                onClick={e => {
                  document.querySelectorAll('.nav-link').forEach(el => {
                    el.style.color = c.stone;
                    el.style.borderBottom = "none";
                    el.style.fontWeight = 400;
                    el.style.paddingBottom = "0";
                  });
                  e.currentTarget.style.color = c.dark;
                  e.currentTarget.style.borderBottom = `1.5px solid ${c.dark}`;
                  e.currentTarget.style.fontWeight = 500;
                  e.currentTarget.style.paddingBottom = "2px";
                }}
                className="nav-link"
                style={{
                  fontSize: "12px", color: i === 0 ? c.dark : c.stone,
                  textDecoration: "none", fontWeight: i === 0 ? 500 : 400,
                  letterSpacing: "0.06em",
                  borderBottom: i === 0 ? `1.5px solid ${c.dark}` : "none",
                  paddingBottom: i === 0 ? "2px" : "0",
                }}>{l.label}</a>
            ))}
          </div>
          <div>
            {token ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <a href={getDashboardPath()} style={{
                  padding: "8px 20px", borderRadius: "4px", background: "none", color: c.stone,
                  fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
                  textDecoration: "none", border: `1px solid ${c.border}`,
                }}>Dashboard</a>
                <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.reload(); }} style={{
                  padding: "8px 20px", borderRadius: "4px", background: c.sand, color: c.dark,
                  fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
                  border: "none", cursor: "pointer",
                }}>Logout</button>
              </div>
            ) : (
              <a href="/signup" style={{
                padding: "10px 28px", borderRadius: "4px", background: c.sand, color: c.dark,
                fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                textDecoration: "none", display: "inline-block",
              }} className="btn-get-started">GET STARTED</a>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section style={{ position: "relative", width: "100%", height: "520px", overflow: "hidden" }}>
          <img src={heroImg} alt="Beautiful interior" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(247,243,238,0.92) 38%, rgba(247,243,238,0.1) 70%)",
          }} />
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", maxWidth: "600px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em", color: c.stone, textTransform: "uppercase", marginBottom: "16px" }}>
              DESIGN. CURATE. ELEVATE.
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "58px", fontWeight: 400,
              color: c.dark, lineHeight: 1.1, marginBottom: "12px",
            }}>
              Beautiful Spaces,<br />Thoughtfully Designed.
            </h1>
            <div style={{ width: "48px", height: "2px", background: c.sand, marginBottom: "24px" }} />
            <p style={{ fontSize: "14px", color: c.muted, fontWeight: 300, lineHeight: 1.75, marginBottom: "0", maxWidth: "380px" }}>
              Swagne is your all-in-one platform for luxury interior design. Connecting clients, designers, and providers to create extraordinary spaces, seamlessly.
            </p>
          </div>
        </section>

{/* HOW IT WORKS — same original layout, content updated to match the request journey */}
<section id="how-it-works" style={{ background: c.card, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", minHeight: "180px" }}>
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRight: `1px solid ${c.border}`, padding: "40px 32px",
    }}>
      <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", color: c.stone, textTransform: "uppercase", writingMode: "horizontal-tb" }}>HOW IT WORKS</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
      {[
        { n: "01", icon: <User size={20} strokeWidth={1.5} />,         title: "CREATE YOUR REQUEST",    desc: "Fill in your project details — service type, space, budget, and preferred style." },
        { n: "02", icon: <Search size={20} strokeWidth={1.5} />,        title: "DESIGNER REVIEWS",       desc: "A matched designer reviews your request, accepts it, and starts building a plan." },
        { n: "03", icon: <ClipboardList size={20} strokeWidth={1.5} />, title: "PLAN & OFFERS",          desc: "The designer creates a design vision and collects execution offers from contractors." },
        { n: "04", icon: <Box size={20} strokeWidth={1.5} />,           title: "PACKAGE DELIVERED",      desc: "You receive the full package — design plan, contractor offers, and a recommendation." },
        { n: "05", icon: <CheckCircle size={20} strokeWidth={1.5} />,   title: "SELECT & START",         desc: "Choose the best offer and watch your space come to life with the selected contractor." },
      ].map((s, i) => (
        <div key={i} style={{ padding: "36px 24px", borderLeft: `1px solid ${c.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 400, color: c.dark }}>{s.n}</span>
            <span style={{ color: c.stone }}>{s.icon}</span>
          </div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: c.dark, letterSpacing: "0.08em", marginBottom: "10px" }}>{s.title}</div>
          <div style={{ fontSize: "12px", color: c.muted, fontWeight: 300, lineHeight: 1.7 }}>{s.desc}</div>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* WHO WE SERVE */}
        <section id="services" style={{ background: c.card, borderBottom: `1px solid ${c.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRight: `1px solid ${c.border}`, padding: "40px 32px",
            }}>
              <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", color: c.stone, textTransform: "uppercase" }}>WHO WE SERVE</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
              {roles.map((r, i) => (
                <div key={i} style={{
                  padding: "40px 36px", borderLeft: `1px solid ${c.border}`,
                  display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "20px",
                }}>
                  <div style={{ flexShrink: 0, marginTop: "2px" }}>{r.icon}</div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: c.dark, letterSpacing: "0.1em", marginBottom: "8px" }}>{r.title}</div>
                    <div style={{ fontSize: "12px", color: c.muted, fontWeight: 300, lineHeight: 1.75 }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: c.dark, padding: "72px 64px",
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center", gap: "48px",
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "44px",
            fontWeight: 400, color: "#FFFFFF", lineHeight: 1.15, margin: 0, gridColumn: "1",
          }}>
            Let's Design Something Extraordinary Together.
          </h2>
          <p style={{
            fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 300,
            lineHeight: 1.8, margin: 0, gridColumn: "2",
          }}>
            Join Swagne and be part of a curated community that values craftsmanship, collaboration, and timeless design.
          </p>
          <div style={{ gridColumn: "3", display: "flex", justifyContent: "flex-end" }}>
            <a href="/signup" style={{
              display: "inline-flex", alignItems: "center", gap: "12px",
              padding: "16px 32px", border: `1px solid rgba(255,255,255,0.4)`,
              color: "#FFFFFF", fontSize: "12px", fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none",
              borderRadius: "2px",
            }} className="btn-cta">
              JOIN SWAGNE
              <span style={{ fontSize: "16px" }}>→</span>
            </a>
          </div>
        </section>

      </div>
    </>
  );
}
