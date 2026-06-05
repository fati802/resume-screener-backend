"""
Email extractor — extracts email address from resume text.
"""

import re


def extract_email(text: str) -> str:
    """
    Extract the first email address found in resume text.
    Uses regex pattern matching.
    """

    pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    matches = re.findall(pattern, text)

    if matches:
        return matches[0].lower().strip()

    return ""