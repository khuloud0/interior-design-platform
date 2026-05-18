from datetime import datetime
from app import db


class SelectedOffer(db.Model):
    __tablename__ = "selected_offers"

    id = db.Column(db.Integer, primary_key=True)

    # Each execution step can have only one selected offer
    step_id = db.Column(
        db.Integer,
        db.ForeignKey("execution_steps.id"),
        nullable=False,
        unique=True
    )

    # The offer selected by the homeowner
    offer_id = db.Column(
        db.Integer,
        db.ForeignKey("offers.id"),
        nullable=False
    )

    # Homeowner/client who selected the offer
    homeowner_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    selected_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    execution_step = db.relationship(
        "ExecutionStep",
        backref=db.backref("selected_offer", uselist=False)
    )

    offer = db.relationship(
        "Offer",
        backref=db.backref("selected_offer", uselist=False)
    )

    homeowner = db.relationship(
        "User",
        foreign_keys=[homeowner_id],
        backref=db.backref("selected_offers", lazy=True)
    )

    def __repr__(self):
        return f"<SelectedOffer id={self.id} step_id={self.step_id} offer_id={self.offer_id}>"
