"""
Generate summary — uses Gemini AI to generate a candidate summary.
"""

import google.generativeai as genai
from app.core.config import get_settings

settings = get_settings()
genai.configure(api_key=settings.GEMINI_API_KEY)


async def generate_candidate_summary(
    candidate_name: str,
    skills: list,
    experience_years: float,
    education: list,
    job_title: str,
) -> str:
    """
    Generate a professional summary for a candidate using Gemini AI.
    """
    if not settings.GEMINI_API_KEY:
        return _fallback_summary(candidate_name, skills, experience_years)

    prompt = f"""
    Generate a concise 3-sentence professional summary for a job candidate.
    
    Candidate: {candidate_name}
    Applying for: {job_title}
    Skills: {", ".join(skills[:10])}
    Experience: {experience_years} years
    Education: {", ".join([e.get("degree", "") for e in education[:2]])}
    
    Write in third person. Be professional and specific. No bullet points.
    """

    try:
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return _fallback_summary(candidate_name, skills, experience_years)


def _fallback_summary(name: str, skills: list, years: float) -> str:
    """Fallback summary when Gemini is unavailable."""
    top_skills = ", ".join(skills[:5]) if skills else "various technologies"
    return (
        f"{name} is a professional with {years:.0f} years of experience. "
        f"Core skills include {top_skills}. "
        f"Available for new opportunities."
    )