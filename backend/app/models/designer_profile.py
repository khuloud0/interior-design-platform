from app import db


class DesignerProfile(db.Model):
    __tablename__ = "designer_profiles"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    specialty = db.Column(db.String(100), nullable=True)
    portfolio_url = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    user = db.relationship(
        "User",
        back_populates="designer_profile"
    )

    def __repr__(self):
        return f"<DesignerProfile user_id={self.user_id}>"
