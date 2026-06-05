"""
Name extractor — extracts candidate name from resume text.
"""

import re
import spacy

nlp = spacy.load("en_core_web_sm")


def extract_name(text: str) -> str:
    """
    Extract candidate name from resume text.
    """
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    for line in lines[:5]:
        # Skip lines with emails, phones, URLs, or short technical words
        if "@" in line: continue
        if re.search(r"\d{5,}", line): continue
        if re.search(r"http|www\.", line, re.IGNORECASE): continue
        if re.search(r"[+\-]{2,}", line): continue
        if len(line.split()) > 5: continue
        if len(line) < 3: continue
        # Skip lines that are all uppercase acronyms or technical terms
        if re.match(r"^[A-Z+#]{2,}$", line): continue
        # Check if it looks like a name
        if re.match(r"^[A-Za-z\s\.\-]+$", line):
            return line

    # Try spaCy NER
    doc = nlp(text[:1000])
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text.strip()

    return "Unknown"