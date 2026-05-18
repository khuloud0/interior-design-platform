from datetime import datetime
from app import db


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)

    # One project is created from one design request
    request_id = db.Column(
        db.Integer,
        db.ForeignKey("design_requests.id"),
        nullable=False,
        unique=True
    )

    # Homeowner/client who owns the project
    homeowner_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

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

    design_request = db.relationship(
        "DesignRequest",
        backref=db.backref("project", uselist=False)
    )

    homeowner = db.relationship(
        "User",
        foreign_keys=[homeowner_id],
        backref=db.backref("projects", lazy=True)
    )

    def __repr__(self):
        return f"<Project id={self.id} request_id={self.request_id}>"
