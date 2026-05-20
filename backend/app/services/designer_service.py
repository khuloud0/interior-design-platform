import os
import uuid

import boto3
from werkzeug.utils import secure_filename

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
        years_experience=data.get("years_experience", 0),
        starting_price=data.get("starting_price"),
        completed_projects=data.get("completed_projects", 0),
        rating=data.get("rating", 0),
        portfolio_count=data.get("portfolio_count", 0),
        is_verified=data.get("is_verified", False),
        styles=data.get("styles", []),
        service_types=data.get("service_types", []),
        space_types=data.get("space_types", []),
        portfolio_images=data.get("portfolio_images", []),
        profile_image=data.get("profile_image"),
        cover_image=data.get("cover_image"),
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
        "specialty",
        "bio",
        "city",
        "years_experience",
        "starting_price",
        "styles",
        "service_types",
        "space_types",
        "profile_image",
        "cover_image",
        "portfolio_images",
    ]

    for field in updatable_fields:
        if field in data:
            setattr(designer, field, data[field])

    db.session.commit()
    return designer.to_dict(), 200



def upload_portfolio_image(user_id, file):
    designer = DesignerProfile.query.filter_by(user_id=user_id).first()

    if not designer:
        return {"error": "Designer not found"}, 404

    if not file:
        return {"error": "Image file is required"}, 400

    allowed_extensions = {"jpg", "jpeg", "png", "webp"}
    filename = secure_filename(file.filename)

    if "." not in filename:
        return {"error": "Invalid image file"}, 400

    extension = filename.rsplit(".", 1)[1].lower()

    if extension not in allowed_extensions:
        return {"error": "Invalid image file"}, 400

    bucket_name = os.getenv("AWS_S3_BUCKET")
    region = os.getenv("AWS_REGION")

    if not bucket_name or not region:
        return {"error": "S3 configuration is missing"}, 500

    unique_filename = f"designers/{user_id}/portfolio/{uuid.uuid4()}.{extension}"

    s3_client = boto3.client(
        "s3",
        region_name=region,
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )

    s3_client.upload_fileobj(
        file,
        bucket_name,
        unique_filename,
        ExtraArgs={
            "ContentType": file.content_type,
        }
    )

    image_url = (
        f"https://{bucket_name}.s3.{region}.amazonaws.com/"
        f"{unique_filename}"
    )

    portfolio_images = designer.portfolio_images or []
    portfolio_images.append(image_url)

    designer.portfolio_images = portfolio_images
    designer.portfolio_count = len(portfolio_images)

    db.session.commit()

    return {
        "message": "Portfolio image uploaded successfully",
        "image_url": image_url,
        "portfolio_images": portfolio_images,
    }, 201
