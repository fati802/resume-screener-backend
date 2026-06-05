"""
Text preprocessor — cleans and normalizes raw resume text.
"""

import re
import spacy

# Load spaCy model
nlp = spacy.load("en_core_web_sm")


def preprocess_text(text: str) -> str:
    """
    Clean and normalize raw text.
    Removes extra whitespace, special characters, and lowercases.
    """
    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text)

    # Remove special characters except common punctuation
    text = re.sub(r"[^\w\s\.\,\-\@\+]", " ", text)

    # Strip leading/trailing whitespace
    text = text.strip()

    return text


def tokenize(text: str) -> list:
    """
    Tokenize text into a list of clean lowercase tokens.
    Removes stopwords and punctuation.
    """
    doc = nlp(text.lower())
    tokens = [
        token.lemma_
        for token in doc
        if not token.is_stop
        and not token.is_punct
        and not token.is_space
        and len(token.text) > 1
    ]
    return tokens


def get_sentences(text: str) -> list:
    """
    Split text into sentences using spaCy.
    """
    doc = nlp(text)
    return [sent.text.strip() for sent in doc.sents]