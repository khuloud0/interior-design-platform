from datetime import datetime
from app import db


class DesignRequestAttachment(db.Model):
    __tablename__ = "design_request_attachments"

    id = db.Column(db.Integer, primary_key=True)

    design_request_id = db.Column(
        db.Integer,
        db.ForeignKey("design_requests.id"),
        nullable=False
    )

    file_url = db.Column(
        db.Text,
        nullable=False
    )

    file_type = db.Column(
        db.String(50),
        nullable=False
    )

    uploaded_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    design_request = db.relationship(
        "DesignRequest",
        backref=db.backref("attachments", lazy=True)
    )

    def __repr__(self):
        return f"<Attachment id={self.id}>"
