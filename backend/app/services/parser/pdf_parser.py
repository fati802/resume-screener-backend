"""
PDF parser — extracts raw text from PDF resume files.
"""

import pdfplumber


async def parse_pdf(file_path: str) -> str:
    """
    Extract all text from a PDF file.
    Returns the full text as a single string.
    """
    text_parts = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text.strip())

    return "\n".join(text_parts)