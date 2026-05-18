from datetime import datetime
from app import db


class Offer(db.Model):
    __tablename__ = "offers"

    id = db.Column(db.Integer, primary_key=True)

    # Offer is submitted for one execution step
    step_id = db.Column(
        db.Integer,
        db.ForeignKey("execution_steps.id"),
        nullable=False
    )

    # Provider submitting the offer; taken from authenticated token
    provider_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    price = db.Column(db.Float, nullable=False)
    duration = db.Column(db.String(100), nullable=False)

    # Optional provider notes
    notes = db.Column(db.Text, nullable=True)

    # Designer can later mark an offer as recommended
    is_recommended = db.Column(
        db.Boolean,
        nullable=False,
        default=False,
        server_default="false"
    )

    # Available status values: pending / recommended / selected / rejected
    status = db.Column(
        db.String(50),
        nullable=False,
        default="pending",
        server_default="pending"
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    execution_step = db.relationship(
        "ExecutionStep",
        backref=db.backref("offers", lazy=True)
    )

    provider = db.relationship(
        "User",
        foreign_keys=[provider_id],
        backref=db.backref("offers", lazy=True)
    )

    def __repr__(self):
        return f"<Offer id={self.id} step_id={self.step_id} provider_id={self.provider_id}>"
