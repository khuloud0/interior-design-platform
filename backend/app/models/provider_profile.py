from app import db


class ProviderProfile(db.Model):
    __tablename__ = "provider_profiles"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    company_name = db.Column(db.String(120), nullable=True)
    service_type = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    user = db.relationship(
        "User",
        back_populates="provider_profile"
    )

    def __repr__(self):
        return f"<ProviderProfile user_id={self.user_id}>"
