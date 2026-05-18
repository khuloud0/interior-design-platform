from app import db
from datetime import datetime


class DesignerProfile(db.Model):
    __tablename__ = "designer_profiles"

    # ── Primary key ───────────────────────────────────────────
    id = db.Column(db.Integer, primary_key=True)

    # ── Foreign key ───────────────────────────────────────────
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        unique=True,
    )

    # ── Public profile identity ───────────────────────────────
    slug = db.Column(
        db.String(120),
        unique=True,
        nullable=True,
        index=True,
        # e.g. "sara-alharbi" → /designers/sara-alharbi
        # generated from user.name on profile creation
    )
    specialty = db.Column(db.String(120), nullable=True)
    # e.g. "Luxury & Modern Interiors"

    bio = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(80), nullable=True)
    # Current MVP: Riyadh only. Ready for expansion later.

    years_experience = db.Column(db.Integer, nullable=True, default=0)
    starting_price = db.Column(db.Integer, nullable=True)
    # SAR — shown as "Starting from X SAR" on the card

    # ── Trust & verification ──────────────────────────────────
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    # False until a real verification process is implemented

    # ── Stats — manual for now ────────────────────────────────
    # Later: completed_projects computed from design_requests
    #        rating computed from a reviews table
    #        portfolio_count computed from portfolio entries
    completed_projects = db.Column(db.Integer, default=0, nullable=False)
    rating = db.Column(db.Float, default=0.0, nullable=False)
    portfolio_count = db.Column(db.Integer, default=0, nullable=False)

    # ── Images — string URLs ──────────────────────────────────
    # Current: Unsplash placeholders in frontend
    # Later: real URLs from S3 / Cloudinary
    profile_image = db.Column(db.String(500), nullable=True)
    cover_image = db.Column(db.String(500), nullable=True)

    # ── JSON arrays — MVP; extract to tables later if needed ──
    # styles:          ["Modern", "Luxury", "Classic"]
    # service_types:   ["Full Interior Design", "Execution Supervision"]
    # space_types:     ["Bedroom", "Majlis", "Villa"]
    # portfolio_images: ["https://...", "https://...", "https://..."]
    styles = db.Column(db.JSON, nullable=True, default=list)
    service_types = db.Column(db.JSON, nullable=True, default=list)
    space_types = db.Column(db.JSON, nullable=True, default=list)
    portfolio_images = db.Column(db.JSON, nullable=True, default=list)
    # max 3 images shown on the explore card

    # ── Legacy field (kept for backward compat) ───────────────
    portfolio_url = db.Column(db.String(255), nullable=True)
    # external portfolio link — optional, may be removed later

    # ── Timestamps ────────────────────────────────────────────
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # ── Relationship ──────────────────────────────────────────
    user = db.relationship("User", back_populates="designer_profile")

    # ── Serializer — matches DesignerShape v2 on the frontend ─
    def to_dict(self):
        return {
            "id":                  self.id,
            "user_id":             self.user_id,
            "slug":                self.slug,
            "name":                self.user.name if self.user else None,
            "specialty":           self.specialty,
            "city":                self.city,
            "bio":                 self.bio,
            "is_verified":         self.is_verified,

            # JSON arrays
            "styles":              self.styles or [],
            "service_types":       self.service_types or [],
            "space_types":         self.space_types or [],
            "portfolio_images":    self.portfolio_images or [],

            # Stats
            "completed_projects":  self.completed_projects,
            "rating":              self.rating,
            "years_experience":    self.years_experience,
            "starting_price":      self.starting_price,
            "portfolio_count":     self.portfolio_count,

            # Images
            "profile_image":       self.profile_image,
            "cover_image":         self.cover_image,

            # Timestamps
            "created_at":          self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<DesignerProfile user_id={self.user_id} slug={self.slug!r}>"
