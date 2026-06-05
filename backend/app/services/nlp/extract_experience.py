"""
Experience extractor — extracts work experience from resume text.
"""

import re
from typing import List, Dict, Any, Tuple

EXPERIENCE_KEYWORDS = [
    "experience", "work history", "employment", "career",
    "professional background", "work experience",
]

MONTHS = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
    "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
]


def extract_experience(text: str) -> Tuple[List[Dict[str, Any]], float]:
    """
    Extract work experience entries and total years from resume text.
    Returns tuple of (experience_list, total_years).
    """
    experience = []
    total_years = 0.0
    lines = text.split("\n")

    # Find year ranges like 2019-2022 or 2020 - Present
    year_pattern = r"\b(20\d{2}|19\d{2})\s*[-–]\s*(20\d{2}|19\d{2}|present|current)\b"
    matches = re.finditer(year_pattern, text, re.IGNORECASE)

    for match in matches:
        start_str = match.group(1)
        end_str = match.group(2).lower()

        start_year = int(start_str)
        end_year = 2024 if end_str in ("present", "current") else int(end_str)

        years = max(0, end_year - start_year)
        total_years += years

        experience.append({
            "start_year": start_year,
            "end_year": end_str,
            "duration_years": years,
            "description": "",
        })

    # Cap total years at reasonable maximum
    total_years = min(total_years, 40.0)

    return experience, round(total_years, 1)