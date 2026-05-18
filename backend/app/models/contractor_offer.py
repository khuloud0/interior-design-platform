from datetime import datetime
from app import db


class ContractorOffer(db.Model):
    __tablename__ = "contractor_offers"

    id          = db.Column(db.Integer, primary_key=True)
    request_id  = db.Column(db.Integer, db.ForeignKey("design_requests.id"), nullable=False)
    designer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    # بيانات العرض الأصلي من المصمم
    work_type   = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    budget      = db.Column(db.Float, nullable=False)
    duration    = db.Column(db.String(100), nullable=True)
    notes       = db.Column(db.Text, nullable=True)

    # عرض المقاول المخصص (يُملأ لو اختار Submit My Offer)
    provider_budget      = db.Column(db.Float, nullable=True)
    provider_duration    = db.Column(db.String(100), nullable=True)
    provider_description = db.Column(db.Text, nullable=True)
    provider_notes       = db.Column(db.Text, nullable=True)

    # ✅ توصية المصمم على العرض (تُضاف عند الإرسال للعميل)
    designer_recommendation = db.Column(db.Text, nullable=True)

    # pending / submitted / selected_for_client / active / declined
    status     = db.Column(db.String(50), nullable=False, default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    request  = db.relationship("DesignRequest", backref=db.backref("contractor_offers", lazy=True))
    designer = db.relationship("User", foreign_keys=[designer_id])
    provider = db.relationship("User", foreign_keys=[provider_id])

    def to_dict(self):
        return {
            "id":                      self.id,
            "request_id":              self.request_id,
            "designer_id":             self.designer_id,
            "designer_name":           self.designer.name if self.designer else None,
            "provider_id":             self.provider_id,
            "provider_name":           self.provider.name if self.provider else None,
            # العرض الأصلي من المصمم
            "work_type":               self.work_type,
            "description":             self.description,
            "budget":                  self.budget,
            "duration":                self.duration,
            "notes":                   self.notes,
            # عرض المقاول المخصص
            "provider_budget":         self.provider_budget,
            "provider_duration":       self.provider_duration,
            "provider_description":    self.provider_description,
            "provider_notes":          self.provider_notes,
            # توصية المصمم
            "designer_recommendation": self.designer_recommendation,
            "status":                  self.status,
            "created_at":              self.created_at.isoformat() if self.created_at else None,
        }
