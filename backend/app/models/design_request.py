from datetime import datetime
from app import db


class DesignRequest(db.Model):
    __tablename__ = "design_requests"

    id = db.Column(db.Integer, primary_key=True)

    homeowner_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    designer_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )

    service_type = db.Column(
        db.String(100),
        nullable=False
    )

    space_type = db.Column(
        db.String(100),
        nullable=False
    )

    space_details = db.Column(
        db.Text,
        nullable=False
    )

    preferred_style = db.Column(db.String(100))
    preferred_colors = db.Column(db.String(255))

    budget = db.Column(
        db.Float,
        nullable=False
    )

    needs_3d_design = db.Column(db.Boolean, default=False)
    needs_execution_drawings = db.Column(db.Boolean, default=False)

    inspiration_images = db.Column(db.Text)
    floor_plan_file = db.Column(db.Text)

    # Available status values:
    # pending
    # in_progress
    # execution_plan_ready
    # offers_ready
    # completed
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

    homeowner = db.relationship(
        "User",
        foreign_keys=[homeowner_id],
        backref=db.backref("design_requests", lazy=True)
    )

    designer = db.relationship(
        "User",
        foreign_keys=[designer_id]
    )

    def to_dict(self):
        return {
            "id": self.id,

            "client_name": (
                self.homeowner.name
                if self.homeowner
                else None
            ),

            "space_type": self.space_type,

            "preferred_style": self.preferred_style,

            "budget": self.budget,

            "status": self.status,

            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
        }

    def __repr__(self):
        return f"<DesignRequest id={self.id} homeowner_id={self.homeowner_id}>"
