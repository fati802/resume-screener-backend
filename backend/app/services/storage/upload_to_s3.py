"""
S3 uploader — uploads resume files to AWS S3.
"""

import boto3
import uuid
import os
from app.core.config import get_settings

settings = get_settings()


def get_s3_client():
    """Get boto3 S3 client."""
    return boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )


async def upload_to_s3(file_path: str, original_filename: str) -> str:
    """
    Upload a file to AWS S3.
    Returns the S3 URL of the uploaded file.
    """
    if settings.STORAGE_BACKEND != "s3":
        return file_path

    try:
        s3 = get_s3_client()
        ext = os.path.splitext(original_filename)[1]
        s3_key = f"resumes/{uuid.uuid4()}{ext}"

        s3.upload_file(
            file_path,
            settings.S3_BUCKET_NAME,
            s3_key,
            ExtraArgs={"ContentType": "application/octet-stream"},
        )

        url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
        return url

    except Exception as e:
        # Fall back to local path if S3 fails
        return file_path