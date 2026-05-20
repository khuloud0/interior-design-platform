from app.models.designer_profile import DesignerProfile
from app import db


def get_all_designers():
    designers = DesignerProfile.query.all()

    return [designer.to_dict() for designer in designers]


def get_designer_by_slug(slug):
    designer = DesignerProfile.query.filter_by(
        slug=slug
    ).first()

    if not designer:
        return {"error": "Designer not found"}, 404

    return designer.to_dict(), 200

def create_designer(data):

    existing_slug = DesignerProfile.query.filter_by(
    slug=data["slug"]
     ).first()

    if existing_slug:
      return {"error": "Slug already exists"}, 400
    
    existing_user = DesignerProfile.query.filter_by(
    user_id=data["user_id"]
     ).first()

    if existing_user:
     return {"error": "Designer profile already exists"}, 400

    designer = DesignerProfile(
        user_id=data["user_id"],
        slug=data["slug"],

        specialty=data.get("specialty"),
        bio=data.get("bio"),
        city=data.get("city"),

        years_experience=data.get(
            "years_experience",
            0
        ),

        starting_price=data.get(
            "starting_price"
        ),

        completed_projects=data.get(
            "completed_projects",
            0
        ),

        rating=data.get(
            "rating",
            0
        ),

        portfolio_count=data.get(
            "portfolio_count",
            0
        ),

        is_verified=data.get(
            "is_verified",
            False
        ),

        styles=data.get(
            "styles",
            []
        ),

        service_types=data.get(
            "service_types",
            []
        ),

        space_types=data.get(
            "space_types",
            []
        ),

        portfolio_images=data.get(
            "portfolio_images",
            []
        ),

        profile_image=data.get(
            "profile_image"
        ),

        cover_image=data.get(
            "cover_image"
        ),
    )

    db.session.add(designer)
    db.session.commit()

    return designer.to_dict(), 201

def get_designer_by_user_id(user_id):
    designer = DesignerProfile.query.filter_by(user_id=user_id).first()
    if not designer:
        return {"error": "Designer not found"}, 404
    return designer.to_dict(), 200

def update_designer(user_id, data):
    designer = DesignerProfile.query.filter_by(user_id=user_id).first()
    if not designer:
        return {"error": "Designer not found"}, 404

    updatable_fields = [
        "specialty", "bio", "city", "years_experience",
        "starting_price", "styles", "service_types",
        "space_types", "profile_image", "cover_image", "portfolio_images",
    ]

    for field in updatable_fields:
        if field in data:
            setattr(designer, field, data[field])

    db.session.commit()
    return designer.to_dict(), 200