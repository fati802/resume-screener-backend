"""
S3 downloader — retrieves resume files from AWS S3.
"""

import boto3
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


def get_presigned_url(s3_key: str, expiry: int = 3600) -> str:
    """
    Generate a presigned URL for temporary access to an S3 file.
    URL expires after the given number of seconds.
    """
    if settings.STORAGE_BACKEND != "s3":
        return s3_key

    try:
        s3 = get_s3_client()
        url = s3.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": settings.S3_BUCKET_NAME,
                "Key": s3_key,
            },
            ExpiresIn=expiry,
        )
        return url
    except Exception:
        return s3_key


def extract_s3_key(s3_url: str) -> str:
    """
    Extract the S3 key from a full S3 URL.
    """
    parts = s3_url.split(".amazonaws.com/")
    if len(parts) == 2:
        return parts[1]
    return s3_url