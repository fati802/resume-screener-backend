"""
Phone extractor — extracts phone number from resume text.
"""

import re


def extract_phone(text: str) -> str:
    """
    Extract the first phone number found in resume text.
    Handles multiple common formats.
    """

    patterns = [
        r"\+?[\d\s\-\(\)]{10,15}",           # General international
        r"\+\d{1,3}[\s\-]?\d{10}",            # +92 3001234567
        r"\(\d{3}\)[\s\-]?\d{3}[\s\-]?\d{4}", # (123) 456-7890
        r"\d{3}[\s\-]\d{3}[\s\-]\d{4}",       # 123-456-7890
        r"\d{10,11}",                           # 03001234567
    ]

    for pattern in patterns:
        matches = re.findall(pattern, text)
        if matches:
            phone = matches[0].strip()
            # Filter out numbers that are too short or look like years
            if len(re.sub(r"\D", "", phone)) >= 10:
                return phone

    return ""