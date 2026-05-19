from app import db
from datetime import datetime


class DesignerProfile(db.Model):
    __tablename__ = "designer_profiles"

    id                  = db.Column(db.Integer, primary_key=True)
    user_id             = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    slug                = db.Column(db.String(120), unique=True, nullable=True, index=True)
    specialty           = db.Column(db.String(120), nullable=True)
    bio                 = db.Column(db.Text, nullable=True)
    city                = db.Column(db.String(80), nullable=True)
    years_experience    = db.Column(db.Integer, nullable=True, default=0)
    starting_price      = db.Column(db.Integer, nullable=True)
    is_verified         = db.Column(db.Boolean, default=False, nullable=False)
    completed_projects  = db.Column(db.Integer, default=0, nullable=False)
    rating              = db.Column(db.Float, default=0.0, nullable=False)
    portfolio_count     = db.Column(db.Integer, default=0, nullable=False)
    profile_image       = db.Column(db.String(500), nullable=True)
    cover_image         = db.Column(db.String(500), nullable=True)
    styles              = db.Column(db.JSON, nullable=True, default=list)
    service_types       = db.Column(db.JSON, nullable=True, default=list)
    space_types         = db.Column(db.JSON, nullable=True, default=list)
    portfolio_images    = db.Column(db.JSON, nullable=True, default=list)
    portfolio_url       = db.Column(db.String(255), nullable=True)
    created_at          = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at          = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = db.relationship("User", back_populates="designer_profile")

    def to_dict(self):
        return {
            "id":                 self.id,
            "user_id":            self.user_id,
            "slug":               self.slug,
            "name":               self.user.name if self.user else None,
            "specialty":          self.specialty,
            "city":               self.city,
            "bio":                self.bio,
            "is_verified":        self.is_verified,
            "styles":             self.styles or [],
            "service_types":      self.service_types or [],
            "space_types":        self.space_types or [],
            "portfolio_images":   self.portfolio_images or [],
            "completed_projects": self.completed_projects,
            "rating":             self.rating,
            "years_experience":   self.years_experience,
            "starting_price":     self.starting_price,
            "portfolio_count":    self.portfolio_count,
            "profile_image":      self.profile_image,
            "cover_image":        self.cover_image,
            "created_at":         self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<DesignerProfile user_id={self.user_id} slug={self.slug!r}>"