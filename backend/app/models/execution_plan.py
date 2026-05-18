from datetime import datetime
from app import db


class ExecutionPlan(db.Model):
    __tablename__ = "execution_plans"

    id = db.Column(db.Integer, primary_key=True)

    # Each design request can have only one execution plan
    request_id = db.Column(
        db.Integer,
        db.ForeignKey("design_requests.id"),
        nullable=False,
        unique=True
    )

    # Designer responsible for creating the execution plan
    designer_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    # Main description of the proposed layout/design solution
    layout_description = db.Column(db.Text, nullable=False)

    # Optional notes from the designer
    notes = db.Column(db.Text, nullable=True)

    # Available status values: draft / published / completed
    status = db.Column(
        db.String(50),
        nullable=False,
        default="draft",
        server_default="draft"
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

    # One DesignRequest has one ExecutionPlan
    design_request = db.relationship(
        "DesignRequest",
        backref=db.backref("execution_plan", uselist=False)
    )

    # One designer/user can create many execution plans
    designer = db.relationship(
        "User",
        foreign_keys=[designer_id],
        backref=db.backref("execution_plans", lazy=True)
    )

    def __repr__(self):
        return f"<ExecutionPlan id={self.id} request_id={self.request_id}>"
