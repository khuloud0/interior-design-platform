import React from "react";
export default function HomePage() {
const token = localStorage.getItem("token");
const c = {
bg: "#F7F3EE", card: "#FFFFFF", sand: "#D4C4B0",
stone: "#8C7B6B", dark: "#3D3128", border: "#E0D5C8",
muted: "#A39080",
};

const LogoMark = () => (
<div style={{
width: "26px", height: "26px", border: `1.5px solid ${c.sand}`,
borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
}}>
<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
<rect x="2" y="2" width="5" height="5" stroke="#8C7B6B" strokeWidth="1" rx="1"/>
<rect x="9" y="2" width="5" height="5" fill="#D4C4B0" rx="1"/>
<rect x="2" y="9" width="5" height="5" fill="#D4C4B0" rx="1"/>
<rect x="9" y="9" width="5" height="5" stroke="#8C7B6B" strokeWidth="1" rx="1"/>
</svg>
</div>
);

const btnPrimary = {
padding: "12px 28px", borderRadius: "8px", background: c.dark, color: c.sand,
fontSize: "11px", fontWeight: 500, fontFamily: "'Jost', sans-serif",
letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
border: "none", cursor: "pointer",
};
const btnGhost = {
padding: "12px 28px", borderRadius: "8px", background: "none", color: c.stone,
fontSize: "11px", fontWeight: 500, fontFamily: "'Jost', sans-serif",
letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
border: `1px solid ${c.border}`, cursor: "pointer",
};
const sectionTag = {
display: "block", fontSize: "9px", fontWeight: 500, color: c.stone,
letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "12px",
};
const sectionTitle = {
fontFamily: "'Cormorant Garamond', serif", fontSize: "36px",
fontWeight: 300, color: c.dark, marginBottom: "16px", lineHeight: 1.2,
};
const divider = { width: "32px", height: "1px", background: c.sand, marginBottom: "24px" };

const steps = [
{ n: "01", title: "Submit Your Request", desc: "Clients share space details, needs, preferences, and budget." },
{ n: "02", title: "Get an Execution Plan", desc: "Designers review the request and break the project into clear steps." },
{ n: "03", title: "Compare Provider Offers", desc: "Providers submit offers for each execution step." },
{ n: "04", title: "Select and Confirm", desc: "Clients choose one provider for each step and confirm the full package." },
{ n: "05", title: "Track Progress", desc: "The project overview shows each step status: pending, in progress, completed." },
];

const roles = [
{
title: "Clients",
desc: "Submit design requests, choose providers, and track project progress.",
icon: (
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C7B6B" strokeWidth="1.5">
<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
</svg>
),
},
{
title: "Designers",
desc: "Convert client needs into actionable execution plans and recommend best offers.",
icon: (
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C7B6B" strokeWidth="1.5">
<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>
),
},
{
title: "Providers",
desc: "Browse available steps, submit offers, and deliver execution work.",
icon: (
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C7B6B" strokeWidth="1.5">
<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
</svg>
),
},
];

return (
<>
<link
href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Jost:wght@300;400;500;600&display=swap"
rel="stylesheet"
/>
<div style={{ fontFamily: "'Jost', sans-serif", color: c.dark, background: c.bg }}>

{/* NAVBAR */}
<nav style={{
background: c.card, borderBottom: `1px solid ${c.border}`,
padding: "0 48px", height: "60px", display: "flex",
alignItems: "center", justifyContent: "space-between",
position: "sticky", top: 0, zIndex: 100,
}}>
<a href="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
<LogoMark />
<span style={{
fontFamily: "'Cormorant Garamond', serif", fontSize: "15px",
fontWeight: 600, letterSpacing: "0.1em", color: c.dark, textTransform: "uppercase",
}}>swagne</span>
</a>
<div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
{["Who We Are", "How It Works", "Who We Serve"].map((l, i) => (
<a key={i} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{
fontSize: "12px", color: c.stone, textDecoration: "none",
fontWeight: 400, letterSpacing: "0.04em",
}}>{l}</a>
))}
</div>
<div style={{ display: "flex", gap: "8px" }}>
{token ? (
<>
<a href="/dashboard" style={{ ...btnGhost, padding: "7px 18px", fontSize: "11px" }}>Dashboard</a>
<button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}
style={{ ...btnPrimary, padding: "7px 18px", fontSize: "11px" }}>Logout</button>
</>
) : (
<>
<a href="/login" style={{ ...btnGhost, padding: "7px 18px", fontSize: "11px" }}>Sign In</a>
<a href="/signup" style={{ ...btnPrimary, padding: "7px 18px", fontSize: "11px" }}>Get Started</a>
</>
)}
</div>
</nav>

{/* HERO */}
<section style={{
background: c.card, borderBottom: `1px solid ${c.border}`,
display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "520px",
}}>
{/* Hero Left */}
<div style={{
padding: "80px 56px 88px", display: "flex", flexDirection: "column",
justifyContent: "center", borderRight: `1px solid ${c.border}`,
}}>
<div style={{
display: "inline-flex", alignItems: "center", gap: "6px",
background: "rgba(140,123,107,0.08)", border: `1px solid ${c.border}`,
borderRadius: "100px", padding: "4px 14px", fontSize: "10px", fontWeight: 500,
color: c.stone, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "22px",
width: "fit-content",
}}>
<span style={{ width: "5px", height: "5px", background: c.sand, borderRadius: "50%", display: "block" }}/>
Interior Design Platform
</div>
<h1 style={{
fontFamily: "'Cormorant Garamond', serif", fontSize: "52px", fontWeight: 300,
color: c.dark, lineHeight: 1.15, marginBottom: "16px",
}}>
Bring your interior design{" "}
<em style={{ fontStyle: "italic", color: c.stone }}>vision</em> to life
</h1>
<p style={{
fontSize: "14px", color: c.muted, fontWeight: 300,
maxWidth: "400px", marginBottom: "32px", lineHeight: 1.7,
}}>
A platform that connects clients, designers, and service providers to turn design ideas into clear execution plans and real projects.
</p>
<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
<a href="/signup" style={btnPrimary}>Get Started</a>
<a href="/login" style={btnGhost}>Sign In</a>
</div>
</div>

{/* Hero Right - Image */}
<div style={{ position: "relative", overflow: "hidden", background: "#EDE7DF" }}>
<img
src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80&auto=format&fit=crop"
alt="Elegant interior design"
style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.95) contrast(1.02) saturate(.9)" }}
/>
<div style={{
position: "absolute", top: "24px", left: "24px",
background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
border: `1px solid ${c.border}`, borderRadius: "8px",
padding: "8px 14px", fontSize: "10px", color: c.stone,
letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500,
}}>Curated Spaces</div>
<img
src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80&auto=format&fit=crop"
alt="Interior detail"
style={{
position: "absolute", bottom: "24px", right: "24px",
width: "160px", height: "120px", borderRadius: "10px",
objectFit: "cover", border: `3px solid ${c.card}`,
boxShadow: "0 4px 20px rgba(61,49,40,.15)",
}}
/>
</div>
</section>

{/* WHO WE ARE */}
<section id="who-we-are" style={{
padding: "72px 48px", background: c.bg, borderTop: `1px solid ${c.border}`,
display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center",
}}>
<div>
<span style={sectionTag}>About</span>
<h2 style={sectionTitle}>Who We Are</h2>
<div style={divider}/>
<p style={{ fontSize: "14px", color: c.muted, fontWeight: 300, lineHeight: 1.8 }}>
We are a platform that bridges the gap between interior design ideas and real execution. Instead of stopping at inspiration, we help users move from design requests to execution plans, provider offers, and project tracking.
</p>
</div>
{/* Image collage */}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: "12px" }}>
<div style={{ gridRow: "span 2", borderRadius: "12px", overflow: "hidden", height: "280px" }}>
<img
src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80&auto=format&fit=crop"
alt="Living room design"
style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.97) saturate(.88)" }}
/>
</div>
<div style={{ borderRadius: "12px", overflow: "hidden", height: "133px" }}>
<img
src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80&auto=format&fit=crop"
alt="Interior detail"
style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.97) saturate(.88)" }}
/>
</div>
<div style={{ borderRadius: "12px", overflow: "hidden", height: "133px" }}>
<img
src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&q=80&auto=format&fit=crop"
alt="Design workspace"
style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.97) saturate(.88)" }}
/>
</div>
</div>
</section>

{/* HOW IT WORKS */}
<section id="how-it-works" style={{
padding: "72px 48px", background: c.card,
borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}`,
}}>
<div style={{ textAlign: "center", marginBottom: "48px" }}>
<span style={sectionTag}>Process</span>
<h2 style={{ ...sectionTitle, marginBottom: "16px" }}>How It Works</h2>
<div style={{ ...divider, margin: "0 auto" }}/>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 0 }}>
{steps.map((s, i) => (
<div key={i} style={{
padding: "28px 20px",
borderLeft: i === 0 ? "none" : `1px solid ${c.border}`,
}}>
<div style={{
fontFamily: "'Cormorant Garamond', serif", fontSize: "32px",
fontWeight: 300, color: c.sand, lineHeight: 1, marginBottom: "12px",
}}>{s.n}</div>
<div style={{ fontSize: "12px", fontWeight: 600, color: c.dark, letterSpacing: "0.04em", marginBottom: "8px" }}>{s.title}</div>
<div style={{ fontSize: "11px", color: c.muted, fontWeight: 300, lineHeight: 1.7 }}>{s.desc}</div>
</div>
))}
</div>
</section>

{/* WHO WE SERVE */}
<section id="who-we-serve" style={{ padding: "72px 48px", background: c.bg, borderTop: `1px solid ${c.border}` }}>
<div style={{ textAlign: "center", marginBottom: "40px" }}>
<span style={sectionTag}>Roles</span>
<h2 style={{ ...sectionTitle, marginBottom: "16px" }}>Who We Serve</h2>
<div style={{ ...divider, margin: "0 auto" }}/>
</div>
<div style={{
display: "grid", gridTemplateColumns: "repeat(3,1fr)",
gap: "16px", maxWidth: "760px", margin: "0 auto",
}}>
{roles.map((r, i) => (
<div key={i} style={{
background: c.card, border: `1px solid ${c.border}`,
borderRadius: "12px", padding: "28px 24px",
}}>
<div style={{
width: "36px", height: "36px", borderRadius: "8px",
background: "rgba(212,196,176,0.3)", border: `1px solid ${c.border}`,
display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
}}>{r.icon}</div>
<div style={{ fontSize: "14px", fontWeight: 600, color: c.dark, marginBottom: "8px" }}>{r.title}</div>
<div style={{ fontSize: "12px", color: c.muted, fontWeight: 300, lineHeight: 1.7 }}>{r.desc}</div>
</div>
))}
</div>
</section>

{/* CTA */}
<section style={{
background: c.dark, borderTop: "1px solid rgba(212,196,176,0.15)",
textAlign: "center", padding: "80px 48px", position: "relative", overflow: "hidden",
}}>
<img
src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop"
alt=""
style={{
position: "absolute", inset: 0, width: "100%", height: "100%",
objectFit: "cover", opacity: 0.08, mixBlendMode: "luminosity",
}}
/>
<h2 style={{
fontFamily: "'Cormorant Garamond', serif", fontSize: "40px",
fontWeight: 300, color: c.sand, marginBottom: "8px", lineHeight: 1.2,
position: "relative",
}}>Ready to start your<br/>design journey?</h2>
<p style={{
fontSize: "13px", color: "rgba(163,144,128,0.8)", fontWeight: 300,
marginBottom: "32px", position: "relative",
}}>
</p>
<div style={{
display: "flex", alignItems: "center", justifyContent: "center",
gap: "12px", flexWrap: "wrap", position: "relative",
}}>
<a href="/signup" style={{
padding: "12px 28px", borderRadius: "8px", background: c.sand, color: c.dark,
fontSize: "11px", fontWeight: 600, fontFamily: "'Jost', sans-serif",
letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
}}>Get Started</a>
<a href="/login" style={{
padding: "12px 28px", borderRadius: "8px", background: "none", color: c.sand,
fontSize: "11px", fontWeight: 400, fontFamily: "'Jost', sans-serif",
letterSpacing: "0.08em", textDecoration: "none",
border: "1px solid rgba(212,196,176,0.3)",
}}>Already have an account? Sign in</a>
</div>
</section>

</div>
</>
);
}