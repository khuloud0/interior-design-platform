from datetime import datetime
from app import db


class ExecutionStep(db.Model):
    __tablename__ = "execution_steps"

    id = db.Column(db.Integer, primary_key=True)

    # Each execution step belongs to one execution plan
    plan_id = db.Column(
        db.Integer,
        db.ForeignKey("execution_plans.id"),
        nullable=False
    )

    description = db.Column(db.Text, nullable=False)

    # Optional notes from the designer
    notes = db.Column(db.Text, nullable=True)

    # Used to order steps inside the same execution plan
    step_order = db.Column(db.Integer, nullable=False)

    # Available status values: pending / in_progress / completed
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

    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    execution_plan = db.relationship(
        "ExecutionPlan",
        backref=db.backref("execution_steps", lazy=True)
    )

    def __repr__(self):
        return f"<ExecutionStep id={self.id} plan_id={self.plan_id}>"
