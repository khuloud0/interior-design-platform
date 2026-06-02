import React from "react";
import {
  Home,
  PenTool,
  Wrench,
  Check,
  Zap,
  Eye,
  Handshake,
  ClipboardList,
  Search,
  Box,
} from "lucide-react";
import logo from "../assets/images/Logo130_27.svg";
import heroImg from "../assets/images/HeroBackground.svg";

export default function HomePage() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const dashboardPath =
    user.role === "designer"
      ? "/designer/dashboard"
      : user.role === "provider"
      ? "/provider/offers"
      : "/dashboard";

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        html { scroll-behavior: smooth; scroll-padding-top: 90px; }
        * { box-sizing: border-box; }
        body { margin: 0; }

        .page {
          background: #F7F1EA;
          color: #2C221A;
          font-family: "Jost", sans-serif;
          overflow-x: hidden;
        }

        h1, h2, h3 { font-family: "Cormorant Garamond", serif; }

        .nav {
          height: 64px;
          padding: 0 46px;
          background: #fff;
          border-bottom: 1px solid #E2D8CE;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .logo { height: 27px; }

        .nav-links {
          display: flex;
          gap: 34px;
          align-items: center;
        }

        .nav-links a {
          color: #8C7B6B;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-link {
          color: #2C221A;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: 13px 18px;
        }

        .btn {
          background: #2C221A;
          color: #F7F1EA;
          text-decoration: none;
          padding: 14px 30px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #2C221A;
        }

        .outline-btn {
          background: #fff;
          color: #2C221A;
          text-decoration: none;
          padding: 14px 30px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #D8C9B6;
        }

        .hero {
          min-height: calc(100vh - 64px);
          padding: 70px 46px 70px;
          display: flex;
          align-items: center;
          background: #F7F1EA;
          border-bottom: 1px solid #E2D8CE;
          position: relative;
          overflow: hidden;
        }

        .hero-image {
          position: absolute;
          right: 0;
          top: 0;
          width: 78%;
          height: 100%;
          z-index: 0;
        }

        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: right center;
        }

        .hero-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            #F7F1EA 0%,
            rgba(247,241,234,.95) 18%,
            rgba(247,241,234,.65) 36%,
            rgba(247,241,234,.20) 58%,
            rgba(247,241,234,0) 78%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 540px;
          margin-top: -28px;
        }

        .eyebrow {
          color: #8C7B6B;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .18em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .hero h1 {
          font-size: clamp(58px, 7vw, 92px);
          line-height: .92;
          margin: 0 0 26px;
        }

        .hero p {
          max-width: 520px;
          color: #6B6259;
          line-height: 1.8;
          font-size: 17px;
          margin-bottom: 30px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .section {
          padding: 86px 46px;
          scroll-margin-top: 90px;
        }

        .section-head {
          max-width: 760px;
          margin: 0 auto 54px;
          text-align: center;
        }

        .section-head h2 {
          font-size: clamp(44px, 5vw, 66px);
          line-height: 1;
          margin: 0 0 16px;
        }

        .section-head p {
          color: #8C7B6B;
          line-height: 1.8;
          font-size: 17px;
          margin: 0;
        }

        .benefits { background: #fff; }

        .benefit-grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .benefit-card {
          background: #fff;
          border: 1px solid #E2D8CE;
          border-radius: 18px;
          padding: 34px;
          min-height: 245px;
          transition: .2s;
        }

        .benefit-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 45px rgba(44,34,26,.08);
        }

        .icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: #F7F1EA;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2C221A;
          margin-bottom: 28px;
        }

        .benefit-card h3, .role-card h3 {
          font-size: 28px;
          margin: 0 0 12px;
        }

        .benefit-card p, .role-card p {
          color: #6B6259;
          line-height: 1.7;
          margin: 0;
          font-size: 15px;
        }

        .workflow {
          background: #F7F1EA;
          position: relative;
          overflow: hidden;
        }

        .brand-roadmap {
          max-width: 1120px;
          margin: 0 auto;
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          padding-top: 30px;
        }

        .brand-roadmap::before {
          content: "";
          position: absolute;
          top: 75px;
          left: 12%;
          right: 12%;
          height: 2px;
          background: linear-gradient(to right, #D4C4B0, #8C7B6B, #D4C4B0);
          z-index: 0;
        }

        .road-step {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 0 14px;
        }

        .logo-node {
          width: 86px;
          height: 86px;
          margin: 0 auto 26px;
          border-radius: 22px;
          background: #fff;
          border: 1px solid #E2D8CE;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 8px;
          padding: 16px;
          box-shadow: 0 18px 45px rgba(44,34,26,.08);
          transition: .25s ease;
        }

        .logo-node span {
          border-radius: 8px;
          background: #F7F1EA;
          border: 1px solid #D4C4B0;
        }

        .node-one span {
          grid-column: 1;
          grid-row: 1;
        }

        .node-two span:nth-child(1) {
          grid-column: 1;
          grid-row: 1;
        }

        .node-two span:nth-child(2) {
          grid-column: 2;
          grid-row: 1;
        }

        .node-three span:nth-child(1) {
          grid-column: 1;
          grid-row: 1;
        }

        .node-three span:nth-child(2) {
          grid-column: 2;
          grid-row: 1;
        }

        .node-three span:nth-child(3) {
          grid-column: 1;
          grid-row: 2;
        }

        .node-four span:nth-child(1) {
          grid-column: 1;
          grid-row: 1;
        }

        .node-four span:nth-child(2) {
          grid-column: 2;
          grid-row: 1;
        }

        .node-four span:nth-child(3) {
          grid-column: 1;
          grid-row: 2;
        }

        .node-four span:nth-child(4) {
          grid-column: 2;
          grid-row: 2;
        }

        .road-step.final .logo-node {
          background: #2C221A;
          border-color: #2C221A;
        }

        .road-step.final .logo-node span {
          background: #F7F1EA;
          border-color: rgba(255,255,255,.55);
        }

        .road-step:hover .logo-node {
          transform: translateY(-6px);
          box-shadow: 0 24px 55px rgba(44,34,26,.14);
        }

        .road-step h3 {
          font-size: 27px;
          margin: 0 0 16px;
        }

        .road-step p {
          max-width: 230px;
          margin: 0 auto;
          color: #6B6259;
          font-size: 14px;
          line-height: 1.7;
        }

        .roles { background: #fff; }

        .role-grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: stretch;
        }

        .role-card {
          background: #fff;
          border: 1px solid #E2D8CE;
          border-radius: 18px;
          padding: 34px;
          min-height: 390px;
          transition: .2s;
          display: flex;
          flex-direction: column;
        }

        .role-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 45px rgba(44,34,26,.08);
        }

        .role-card.main {
          background: #2C221A;
          color: #fff;
          border-color: #2C221A;
        }

        .role-card.main p {
          color: rgba(255,255,255,.72);
        }

        .role-card p {
          min-height: 78px;
        }

        .role-card ul {
          list-style: none;
          padding: 0;
          margin: 24px 0 0;
          display: grid;
          gap: 12px;
          color: #6B6259;
          font-size: 14px;
        }

        .role-card.main ul {
          color: rgba(255,255,255,.78);
        }

        .role-card li {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .role-btn {
          margin-top: 28px;
          width: 100%;
          background: #2C221A;
          color: #F7F1EA;
          text-decoration: none;
          padding: 13px 18px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .role-card.main .role-btn {
          background: #fff;
          color: #2C221A;
        }

        .role-btn:hover, .btn:hover, .outline-btn:hover, .login-link:hover {
          opacity: .88;
        }

        .footer {
          background: #2C221A;
          color: #fff;
          padding: 70px 46px;
        }

        .footer-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 1fr auto;
          gap: 40px;
          align-items: center;
        }

        .footer h2 {
          font-size: clamp(40px, 5vw, 62px);
          line-height: 1;
          margin: 0;
        }

        .footer p {
          color: rgba(255,255,255,.68);
          line-height: 1.8;
          margin: 0;
        }

        .light-btn {
          background: #fff;
          color: #2C221A;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        @media (max-width: 1000px) {
          .nav { padding: 0 22px; }
          .nav-links { display: none; }

          .hero {
            min-height: auto;
            padding: 62px 24px 320px;
          }

          .hero-content {
            max-width: 100%;
            margin-top: 0;
          }

          .hero-image {
            width: 100%;
            height: 320px;
            top: auto;
            bottom: 0;
          }

          .hero-image::after {
            background: linear-gradient(
              to bottom,
              #F7F1EA 0%,
              rgba(247,241,234,.58) 42%,
              rgba(247,241,234,0) 100%
            );
          }

          .benefit-grid,
          .role-grid,
          .footer-inner {
            grid-template-columns: 1fr;
          }

          .brand-roadmap {
            grid-template-columns: 1fr;
            max-width: 620px;
            gap: 34px;
            padding-top: 0;
          }

          .brand-roadmap::before {
            top: 0;
            bottom: 0;
            left: 43px;
            right: auto;
            width: 2px;
            height: auto;
            background: linear-gradient(to bottom, #D4C4B0, #8C7B6B, #D4C4B0);
          }

          .road-step {
            display: grid;
            grid-template-columns: 86px 1fr;
            gap: 24px;
            text-align: left;
            align-items: center;
            padding: 0;
          }

          .logo-node {
            margin: 0;
          }

          .road-step p {
            margin: 0;
            max-width: 100%;
          }

          .section { padding: 70px 24px; }
          .footer { padding: 58px 24px; }
        }

        @media (max-width: 520px) {
          .nav {
            height: auto;
            min-height: 64px;
            gap: 14px;
          }

          .nav-actions {
            gap: 8px;
          }

          .login-link {
            padding: 10px 6px;
            font-size: 11px;
          }

          .nav .btn {
            padding: 11px 14px;
            font-size: 10px;
          }

          .hero h1 { font-size: 48px; }
          .hero p { font-size: 16px; }
          .hero-actions { flex-direction: column; }
          .hero-actions .btn,
          .hero-actions .outline-btn { width: 100%; }

          .road-step {
            grid-template-columns: 70px 1fr;
            gap: 18px;
          }

          .logo-node {
            width: 70px;
            height: 70px;
            border-radius: 18px;
            padding: 13px;
            gap: 6px;
          }

          .brand-roadmap::before {
            left: 35px;
          }
        }
      `}</style>

      <div className="page">
        <nav className="nav">
          <a href="/">
            <img src={logo} className="logo" alt="Swagne" />
          </a>

          <div className="nav-links">
            <a href="/">Home</a>
            <a href="#benefits">Benefits</a>
            <a href="#workflow">Process</a>
            <a href="#roles">Roles</a>
          </div>

          <div className="nav-actions">
            {token ? (
              <a className="btn" href={dashboardPath}>
                Dashboard
              </a>
            ) : (
              <>
                <a className="login-link" href="/login">
                  Log In
                </a>
                <a className="btn" href="#roles">
                  Get Started
                </a>
              </>
            )}
          </div>
        </nav>

        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">Interior Design Execution Platform</div>
            <h1>Turn Your Design Vision Into Reality.</h1>
            <p>
              Submit your project, receive a structured execution plan, compare
              service provider offers, and manage your interior design journey
              from one organized place.
            </p>

            <div className="hero-actions">
              <a className="btn" href="#roles">
                Get Started
              </a>

              <a className="outline-btn" href="#workflow">
                Explore Process
              </a>
            </div>
          </div>

          <div className="hero-image">
            <img src={heroImg} alt="Luxury interior design" />
          </div>
        </section>

        <section id="benefits" className="section benefits">
          <div className="section-head">
            <div className="eyebrow">Homeowner Benefits</div>
            <h2>Designed to make execution clear, organized, and realistic.</h2>
            <p>
              Swagne helps homeowners avoid scattered communication, unclear
              decisions, and execution confusion by turning design ideas into a
              structured project workflow.
            </p>
          </div>

          <div className="benefit-grid">
            <div className="benefit-card">
              <div className="icon"><ClipboardList size={25} /></div>
              <h3>Complete Clarity</h3>
              <p>
                Know what needs to happen, when it happens, and who is
                responsible for each step.
              </p>
            </div>

            <div className="benefit-card">
              <div className="icon"><Zap size={25} /></div>
              <h3>Organized Workflow</h3>
              <p>
                Move from request to execution without scattered messages or
                unclear next steps.
              </p>
            </div>

            <div className="benefit-card">
              <div className="icon"><Eye size={25} /></div>
              <h3>Better Decisions</h3>
              <p>
                Compare offers and designer recommendations before selecting
                providers.
              </p>
            </div>

            <div className="benefit-card">
              <div className="icon"><Handshake size={25} /></div>
              <h3>Trusted Support</h3>
              <p>
                Keep the design vision connected to the execution process until
                completion.
              </p>
            </div>
          </div>
        </section>

        <section id="workflow" className="section workflow">
          <div className="section-head">
            <div className="eyebrow">Execution Journey</div>
            <h2>From request to execution in clear steps.</h2>
            <p>
              A simple roadmap inspired by Swagne’s logo, showing how the
              journey grows step by step until the project is fully organized.
            </p>
          </div>

          <div className="brand-roadmap">
            <div className="road-step">
              <div className="logo-node node-one">
                <span></span>
              </div>
              <div>
                <h3>Submit Request</h3>
                <p>Share your space, budget, preferred style, and project needs.</p>
              </div>
            </div>

            <div className="road-step">
              <div className="logo-node node-two">
                <span></span>
                <span></span>
              </div>
              <div>
                <h3>Get Plan</h3>
                <p>A designer turns your request into clear execution steps.</p>
              </div>
            </div>

            <div className="road-step">
              <div className="logo-node node-three">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div>
                <h3>Compare Offers</h3>
                <p>Review provider offers, timelines, and recommendations clearly.</p>
              </div>
            </div>

            <div className="road-step final">
              <div className="logo-node node-four">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div>
                <h3>Select & Track</h3>
                <p>
                  Choose providers and follow project progress from one
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="roles" className="section roles">
          <div className="section-head">
            <div className="eyebrow">Choose Your Role</div>
            <h2>Start with the experience that fits you.</h2>
            <p>
              Select your role once, and the sign-up page will open with the
              right option already selected.
            </p>
          </div>

          <div className="role-grid">
            <div className="role-card main">
              <div className="icon"><Home size={28} /></div>
              <h3>For Homeowners</h3>
              <p>
                Start your project, receive a plan, compare offers, choose
                providers, and monitor progress.
              </p>

              <ul>
                <li><Check size={16} /> Clear execution plans</li>
                <li><Check size={16} /> Offer comparison</li>
                <li><Check size={16} /> Progress tracking</li>
              </ul>

              <a className="role-btn" href="/signup?role=client">
                Start as Homeowner
              </a>
            </div>

            <div className="role-card">
              <div className="icon"><PenTool size={28} /></div>
              <h3>For Designers</h3>
              <p>
                Convert homeowner requests into execution plans and recommend
                the most suitable providers and offers.
              </p>

              <ul>
                <li><Check size={16} /> Create execution plans</li>
                <li><Check size={16} /> Recommend providers</li>
                <li><Check size={16} /> Manage project workflow</li>
              </ul>

              <a className="role-btn" href="/signup?role=designer">
                Start as Designer
              </a>
            </div>

            <div className="role-card">
              <div className="icon"><Wrench size={28} /></div>
              <h3>For Providers</h3>
              <p>
                Receive clear execution steps, submit service offers, and work on
                projects that match your expertise.
              </p>

              <ul>
                <li><Check size={16} /> Receive project requests</li>
                <li><Check size={16} /> Submit service offers</li>
                <li><Check size={16} /> Track project opportunities</li>
              </ul>

              <a className="role-btn" href="/signup?role=provider">
                Start as Provider
              </a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-inner">
            <h2>Ready to start your interior project?</h2>
            <p>
              Choose your role and create an account to continue with the right
              experience.
            </p>
            <a className="light-btn" href="#roles">Choose Role</a>
          </div>
        </footer>
      </div>
    </>
  );
}