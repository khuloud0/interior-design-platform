export default function PageLoader({ visible }) {
  if (!visible) return null;
  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "2px", zIndex: 9999,
      }}>
        <div style={{
          height: "100%", background: "#8C7B6B",
          animation: "progress 1.2s ease-in-out infinite",
          transformOrigin: "left",
        }}/>
      </div>

      <div style={{
        position: "fixed", inset: 0,
        background: "rgba(247,243,238,0.6)",
        backdropFilter: "blur(2px)",
        zIndex: 9998,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
          <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" stroke="#8C7B6B" strokeWidth="1" rx="1"/>
            <rect x="9" y="2" width="5" height="5" fill="#D4C4B0" rx="1"/>
            <rect x="2" y="9" width="5" height="5" fill="#D4C4B0" rx="1"/>
            <rect x="9" y="9" width="5" height="5" stroke="#8C7B6B" strokeWidth="1" rx="1"/>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0%   { transform: scaleX(0); opacity: 1; }
          50%  { transform: scaleX(0.7); opacity: 1; }
          100% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </>
  );
}
