from datetime import datetime
from app import db


class DesignPlan(db.Model):
    __tablename__ = "design_plans"

    id               = db.Column(db.Integer, primary_key=True)
    request_id       = db.Column(db.Integer, db.ForeignKey("design_requests.id"), nullable=False)
    designer_id      = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title            = db.Column(db.String(200), nullable=False)
    vision           = db.Column(db.Text, nullable=False)
    materials        = db.Column(db.String(255), nullable=True)
    colors           = db.Column(db.String(255), nullable=True)
    estimated_budget = db.Column(db.Float, nullable=True)
    created_at       = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at       = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    request  = db.relationship("DesignRequest", backref=db.backref("plan", uselist=False))
    designer = db.relationship("User", foreign_keys=[designer_id])
    stages   = db.relationship("PlanStage", backref="plan", cascade="all, delete-orphan", order_by="PlanStage.id")

    def to_dict(self):
        return {
            "id":               self.id,
            "request_id":       self.request_id,
            "designer_id":      self.designer_id,
            "title":            self.title,
            "vision":           self.vision,
            "materials":        self.materials,
            "colors":           self.colors,
            "estimated_budget": self.estimated_budget,
            "stages":           [s.to_dict() for s in self.stages],
            "created_at":       self.created_at.isoformat() if self.created_at else None,
        }


class PlanStage(db.Model):
    __tablename__ = "plan_stages"

    id          = db.Column(db.Integer, primary_key=True)
    plan_id     = db.Column(db.Integer, db.ForeignKey("design_plans.id"), nullable=False)
    title       = db.Column(db.String(200), nullable=False)
    duration    = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    order       = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id":          self.id,
            "title":       self.title,
            "duration":    self.duration,
            "description": self.description,
        }