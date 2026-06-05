"""
File router — routes resume files to the correct parser based on file type.
"""

from typing import Tuple, Dict, Any

from app.services.parser.pdf_parser import parse_pdf
from app.services.parser.docx_parser import parse_docx
from app.services.nlp.extract_name import extract_name
from app.services.nlp.extract_email import extract_email
from app.services.nlp.extract_phone import extract_phone
from app.services.nlp.extract_skills import extract_skills
from app.services.nlp.extract_education import extract_education
from app.services.nlp.extract_experience import extract_experience


async def parse_resume(file_path: str, content_type: str) -> Tuple[str, Dict[str, Any]]:
    """
    Route file to correct parser, extract raw text,
    then run NLP pipeline to extract structured data.

    Returns:
        raw_text: Full extracted text
        parsed_data: Structured dict with name, email, skills, etc.
    """

    # Step 1 — Extract raw text
    if content_type == "application/pdf":
        raw_text = await parse_pdf(file_path)
    else:
        raw_text = await parse_docx(file_path)

    # Step 2 — Run NLP extraction pipeline
    name = extract_name(raw_text)
    email = extract_email(raw_text)
    phone = extract_phone(raw_text)
    skills = extract_skills(raw_text)
    education = extract_education(raw_text)
    experience, total_years = extract_experience(raw_text)

    parsed_data = {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "education": education,
        "experience": experience,
        "total_experience_years": total_years,
    }

    return raw_text, parsed_data