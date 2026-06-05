"""
Generate interview questions — uses Gemini AI to generate interview questions.
"""

import google.generativeai as genai
from typing import List
from app.core.config import get_settings

settings = get_settings()
genai.configure(api_key=settings.GEMINI_API_KEY)


async def generate_interview_questions(
    candidate_name: str,
    skills: List[str],
    job_title: str,
    missing_skills: List[str],
) -> List[str]:
    """
    Generate tailored interview questions for a candidate using Gemini AI.
    """
    if not settings.GEMINI_API_KEY:
        return _fallback_questions(skills, job_title)

    prompt = f"""
    Generate 8 interview questions for a {job_title} position.
    
    Candidate skills: {", ".join(skills[:10])}
    Skills to probe: {", ".join(missing_skills[:5])}
    
    Include:
    - 3 technical questions based on their skills
    - 2 questions probing their skill gaps
    - 2 behavioral questions
    - 1 situational question
    
    Return only the questions as a numbered list. No explanations.
    """

    try:
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        response = model.generate_content(prompt)
        lines = response.text.strip().split("\n")
        questions = [
            line.split(".", 1)[-1].strip()
            for line in lines
            if line.strip() and line[0].isdigit()
        ]
        return questions[:8]
    except Exception:
        return _fallback_questions(skills, job_title)


def _fallback_questions(skills: List[str], job_title: str) -> List[str]:
    """Fallback questions when Gemini is unavailable."""
    return [
        f"Describe your experience with {skills[0] if skills else 'your primary technology'}.",
        f"What interests you most about this {job_title} role?",
        "Describe a challenging project you worked on and how you overcame obstacles.",
        "How do you stay updated with new technologies in your field?",
        "Describe your experience working in a team environment.",
        "How do you approach debugging a complex issue?",
        "Where do you see yourself in 5 years?",
        "Do you have any questions for us?",
    ]