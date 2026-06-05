"""
Generate gap report — builds a human-readable skill gap report.
"""

from typing import Dict, List


def generate_gap_report(
    candidate_name: str,
    job_title: str,
    skill_gap: Dict[str, List[str]],
    overall_score: float,
) -> str:
    """
    Generate a human-readable skill gap report for a candidate.
    """
    matched_required = skill_gap.get("matched_required", [])
    missing_required = skill_gap.get("missing_required", [])
    matched_preferred = skill_gap.get("matched_preferred", [])
    missing_preferred = skill_gap.get("missing_preferred", [])

    if overall_score >= 80:
        verdict = "Strong Match"
    elif overall_score >= 60:
        verdict = "Good Match"
    elif overall_score >= 40:
        verdict = "Partial Match"
    else:
        verdict = "Weak Match"

    report = f"""
SKILL GAP REPORT
================
Candidate : {candidate_name}
Position  : {job_title}
Score     : {overall_score:.1f}/100
Verdict   : {verdict}

REQUIRED SKILLS
---------------
Matched  : {", ".join(matched_required) if matched_required else "None"}
Missing  : {", ".join(missing_required) if missing_required else "None"}

PREFERRED SKILLS
----------------
Matched  : {", ".join(matched_preferred) if matched_preferred else "None"}
Missing  : {", ".join(missing_preferred) if missing_preferred else "None"}
""".strip()

    return report