import React from "react";

const DesignerProfile = () => {
  const designer = {
    id: 2,
    slug: "sara-alharbi",
    name: "Sara",
    specialty: "Luxury & Modern Interiors",
    bio: "Luxury residential designer",
    city: "Riyadh",
    yearsExperience: 7,
    startingPrice: 8000,
    completedProjects: 12,
    rating: 4.9,
    portfolioCount: 18,
    isVerified: false,
    styles: ["Luxury", "Modern"],
    serviceTypes: ["Full Interior Design"],
    spaceTypes: ["Villa", "Majlis"],
    portfolioImages: [],
    profileImage: null,
    coverImage: null,
  };

  const colors = {
    background: "#F6F1EA",
    surface: "#FFFDF9",
    primary: "#2C221A",
    secondary: "#3D3128",
    muted: "#8C7B68",
    border: "#E2D8CE",
  };

  const baseText = {
    fontFamily: "'Jost', sans-serif",
    color: colors.secondary,
  };

  const serif = {
    fontFamily: "'Cormorant Garamond', 'Cormorant', serif",
    fontWeight: 400,
    color: colors.primary,
  };

  const buttonPrimary = {
    backgroundColor: colors.primary,
    color: colors.surface,
    border: "none",
    padding: "14px 34px",
    borderRadius: "10px",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    fontWeight: 600,
  };

  const buttonGhost = {
    backgroundColor: "transparent",
    color: colors.muted,
    border: `1px solid ${colors.border}`,
    padding: "14px 34px",
    borderRadius: "10px",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    cursor: "pointer",
    fontWeight: 600,
  };

  const tagStyle = {
    backgroundColor: colors.primary,
    color: colors.surface,
    padding: "8px 18px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
    display: "inline-block",
    marginRight: "10px",
    marginBottom: "10px",
  };

  const portfolioItems = Array.from(
    { length: Math.min(designer.portfolioCount, 6) },
    (_, index) => index + 1
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.background }}>
      <header
        style={{
          backgroundColor: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
          padding: "24px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ ...serif, fontSize: "28px" }}>Swagne</div>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            ...baseText,
            fontSize: "13px",
          }}
        >
          <span>Home</span>
          <span>Designers</span>
          <span>Projects</span>
          <button style={buttonPrimary}>Contact</button>
        </nav>
      </header>

      <section
        style={{
          backgroundColor: colors.surface,
          padding: "72px 32px 96px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            gap: "48px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              backgroundColor: colors.background,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "64px",
              flexShrink: 0,
            }}
          >
            {designer.profileImage ? (
              <img
                src={designer.profileImage}
                alt={designer.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              "👤"
            )}
          </div>

          <div>
            <h1 style={{ ...serif, fontSize: "52px", margin: "0 0 14px" }}>
              {designer.name} Alharbi
            </h1>

            <p style={{ ...baseText, fontSize: "13px", margin: "0 0 22px" }}>
              {designer.isVerified ? "Verified" : "Not Verified"}
            </p>

            <p
              style={{
                ...baseText,
                fontSize: "14px",
                fontWeight: 700,
                color: colors.primary,
                margin: "0 0 10px",
              }}
            >
              {designer.specialty}
            </p>

            <p style={{ ...baseText, fontSize: "14px", margin: "0 0 28px" }}>
              📍 {designer.city}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "30px",
              }}
            >
              <span
                style={{
                  ...baseText,
                  fontSize: "32px",
                  fontWeight: 700,
                  color: colors.primary,
                }}
              >
                {designer.rating}
              </span>
              <span style={{ ...baseText, fontSize: "16px" }}>★★★★★</span>
            </div>

            <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
              <button style={buttonPrimary}>Contact Designer</button>
              <button style={buttonGhost}>View Portfolio</button>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          backgroundColor: colors.background,
          padding: "64px 32px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "32px",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ ...serif, fontSize: "48px" }}>
              {designer.yearsExperience}
            </div>
            <p style={{ ...baseText, fontSize: "13px" }}>Years Experience</p>
          </div>

          <div>
            <div style={{ ...serif, fontSize: "48px" }}>
              {designer.completedProjects}
            </div>
            <p style={{ ...baseText, fontSize: "13px" }}>Projects Completed</p>
          </div>

          <div>
            <div style={{ ...serif, fontSize: "48px" }}>
              {designer.rating}
            </div>
            <p style={{ ...baseText, fontSize: "13px" }}>Client Rating</p>
          </div>

          <div>
            <div style={{ ...serif, fontSize: "48px" }}>
              {designer.startingPrice.toLocaleString()} SAR
            </div>
            <p style={{ ...baseText, fontSize: "13px" }}>Starting Price</p>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: colors.surface, padding: "80px 32px" }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "70px",
          }}
        >
          <div>
            <h2 style={{ ...serif, fontSize: "32px", marginBottom: "24px" }}>
              About
            </h2>
            <p style={{ ...baseText, fontSize: "15px", lineHeight: 1.8 }}>
              {designer.bio}
            </p>
          </div>

          <div>
            <h2 style={{ ...serif, fontSize: "32px", marginBottom: "24px" }}>
              Services
            </h2>
            {designer.serviceTypes.map((service) => (
              <p
                key={service}
                style={{
                  ...baseText,
                  color: colors.primary,
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                {service}
              </p>
            ))}
          </div>

          <div>
            <h2 style={{ ...serif, fontSize: "32px", marginBottom: "24px" }}>
              Design Styles
            </h2>
            <div>
              {designer.styles.map((style) => (
                <span key={style} style={tagStyle}>
                  {style}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ ...serif, fontSize: "32px", marginBottom: "24px" }}>
              Space Types
            </h2>
            <div>
              {designer.spaceTypes.map((space) => (
                <span key={space} style={tagStyle}>
                  {space}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          backgroundColor: colors.background,
          padding: "80px 32px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ ...serif, fontSize: "32px", marginBottom: "36px" }}>
            Featured Projects ({designer.portfolioCount} total)
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {portfolioItems.map((item, index) => (
              <div
                key={item}
                style={{
                  gridColumn: index === 0 ? "span 2" : "span 1",
                  height: index === 0 ? "320px" : "240px",
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.muted,
                  ...baseText,
                }}
              >
                {designer.portfolioImages.length > 0 ? (
                  <img
                    src={designer.portfolioImages[index]}
                    alt={`Portfolio ${item}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "16px",
                    }}
                  />
                ) : (
                  `Portfolio Image ${item}`
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "36px" }}>
            <span
              style={{
                ...serif,
                fontSize: "28px",
                borderBottom: `1px solid ${colors.primary}`,
                paddingBottom: "4px",
                cursor: "pointer",
              }}
            >
              View All {designer.portfolioCount} Projects →
            </span>
          </div>
        </div>
      </section>

      <section
        style={{
          backgroundColor: colors.surface,
          padding: "88px 32px",
          textAlign: "center",
        }}
      >
        <h2 style={{ ...serif, fontSize: "52px", marginBottom: "24px" }}>
          Ready to Transform Your Space?
        </h2>

        <p
          style={{
            ...baseText,
            fontSize: "14px",
            marginBottom: "34px",
          }}
        >
          Connect with {designer.name} to discuss your interior design project.
        </p>

        <button style={buttonPrimary}>Start Your Project</button>
      </section>
    </div>
  );
};

export default DesignerProfile;