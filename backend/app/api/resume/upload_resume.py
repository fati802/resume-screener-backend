"""
Upload resume endpoint — accepts PDF/DOCX and stores + parses it.
"""

import uuid
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.config import get_settings
from app.core.security import decode_access_token
from app.core.security import security_scheme
from fastapi.security import HTTPAuthorizationCredentials
from app.models.candidate import Candidate
from app.schemas.candidate_schema import CandidateResponse

router = APIRouter()
settings = get_settings()

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


@router.post("/upload", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload a resume file (PDF or DOCX).
    Parses the resume and stores candidate data.
    """

    # Authenticate
    payload = decode_access_token(credentials.credentials)
    recruiter_id = uuid.UUID(payload["sub"])

    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are allowed.",
        )

    # Validate file size
    contents = await file.read()
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds {settings.MAX_FILE_SIZE_MB}MB limit.",
        )

    # Save file locally
    upload_dir = settings.UPLOAD_DIR
    os.makedirs(upload_dir, exist_ok=True)
    file_ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(upload_dir, saved_filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    # Parse resume text
    from app.services.parser.file_router import parse_resume
    raw_text, parsed_data = await parse_resume(file_path, file.content_type)

    # Create candidate record
    candidate = Candidate(
        recruiter_id=recruiter_id,
        full_name=parsed_data.get("name", "Unknown"),
        email=parsed_data.get("email", ""),
        phone=parsed_data.get("phone", ""),
        resume_url=file_path,
        original_filename=file.filename,
        raw_text=raw_text,
        parsed_data=parsed_data,
    )
    db.add(candidate)
    await db.flush()

    return candidate