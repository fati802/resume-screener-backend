"""
Education extractor — extracts education history from resume text.
"""

import re
from typing import List, Dict, Any

DEGREE_PATTERNS = [
    # Full names first (most specific)
    "bachelor of engineering",
    "bachelor of science",
    "bachelor of technology",
    "bachelor of arts",
    "master of science",
    "master of engineering",
    "master of technology",
    "master of arts",
    "master of business administration",
    "doctorate of philosophy",
    "doctor of philosophy",
    # Common abbreviations with dots
    "b.sc", "m.sc", "b.tech", "m.tech",
    "b.eng", "m.eng", "b.e.", "m.e.",
    "b.s.", "m.s.", "b.a.", "m.a.",
    # Short keywords
    "bachelors", "masters", "undergraduate",
    "mba", "phd", "doctorate",
]

# Short 2-letter degree codes checked separately with strict word boundary
SHORT_DEGREES = ["bs", "ms", "be", "me", "ba", "ma"]

FIELD_KEYWORDS = [
    "electrical engineering",
    "computer science",
    "software engineering",
    "mechanical engineering",
    "data science",
    "information technology",
    "mathematics",
    "physics",
    "business administration",
    "economics",
    "electronics",
    "civil engineering",
    "chemical engineering",
    "biomedical",
    "aerospace",
    "telecommunication",
    "computer engineering",
    "systems engineering",
]

INSTITUTION_KEYWORDS = [
    "university", "college", "institute", "school", "academy",
    "nust", "lums", "iiit", "iit", "mit", "stanford", "oxford",
    "national university", "science and technology",
]


def extract_education(text: str) -> List[Dict[str, Any]]:
    education = []
    lines = text.split("\n")

    for i, line in enumerate(lines):
        line_stripped = line.strip()
        line_lower = line_stripped.lower()

        if not line_lower or len(line_stripped) < 5:
            continue

        matched_degree = None

        # Check full degree patterns first
        for deg in DEGREE_PATTERNS:
            pattern = r"\b" + re.escape(deg) + r"\b"
            if re.search(pattern, line_lower):
                matched_degree = deg.title()
                break

        # Check short 2-letter degrees with strict word boundary
        if not matched_degree:
            for deg in SHORT_DEGREES:
                # Must be surrounded by word boundaries and not part of a longer word
                pattern = r"(?<![a-zA-Z])" + deg + r"(?![a-zA-Z])"
                if re.search(pattern, line_lower):
                    matched_degree = deg.upper()
                    break

        if not matched_degree:
            continue

        entry = {
            "degree": matched_degree,
            "field": "",
            "institution": "",
            "year": "",
        }

        # Extract field from same line
        for field in FIELD_KEYWORDS:
            if field in line_lower:
                entry["field"] = field.title()
                break

        # Check next line for field if not found
        if not entry["field"] and i + 1 < len(lines):
            next_lower = lines[i + 1].lower()
            for field in FIELD_KEYWORDS:
                if field in next_lower:
                    entry["field"] = field.title()
                    break

        # Extract year range like 2024-2028
        year_match = re.search(r"\b(19|20)\d{2}[\s\-–]*(19|20)\d{2}\b", line)
        if year_match:
            entry["year"] = year_match.group()
        else:
            single_year = re.search(r"\b(19|20)\d{2}\b", line)
            if single_year:
                entry["year"] = single_year.group()

        # Find institution in nearby lines
        for j in range(max(0, i - 1), min(len(lines), i + 4)):
            if any(kw in lines[j].lower() for kw in INSTITUTION_KEYWORDS):
                entry["institution"] = lines[j].strip()
                break

        education.append(entry)

    # Deduplicate — keep entry with most info
    seen = set()
    unique = []
    for e in education:
        key = e["field"] if e["field"] else e["degree"]
        if key not in seen:
            seen.add(key)
            unique.append(e)

    return unique