"""
Economic scoring formula — pure function, no CrewAI dependency.
Inputs: dict of FRED indicator values.
Output: dict with health_score (0-100), status_label, and score breakdown.
"""

from typing import Any


LABELS = {
    (80, 100): "Optimal",
    (60, 79): "Moderate",
    (40, 59): "Risky",
    (0, 39): "Critical",
}


def _get_label(score: int) -> str:
    for (low, high), label in LABELS.items():
        if low <= score <= high:
            return label
    return "Critical"


def calculate_score(indicators: dict[str, Any]) -> dict[str, Any]:
    """
    Calculate the Business Funding Climate Score from FRED indicator values.

    Scoring formula:
      Baseline: 100
      Deductions:
        - 5 pts per 0.25% DPRIME exceeds 5.0%
        - 1 pt per 1% DRTSCILM (large firm C&I tightening)
        - 0.5 pts per 1% DRTSCIS (small firm C&I tightening)
        - 3 pts if T10Y2Y < 0 (inverted yield curve)
        - 1 pt per 10K ICSA above 250,000 baseline
      Bonuses:
        + 5 pts if BUSAPPWNSAUS trending up vs prior 4-week average
        + 3 pts if T10Y2Y > 1.0 (healthy spread)

    Returns:
      health_score: int 0-100 (clamped)
      status_label: str
      breakdown: dict of individual deductions/bonuses
    """
    dprime: float = indicators["dprime"]
    drtscilm: float = indicators["drtscilm"]
    drtscis: float = indicators["drtscis"]
    t10y2y: float = indicators["t10y2y"]
    icsa: int = int(indicators["icsa"])
    busapp_up: bool = bool(indicators.get("busapp_trending_up", False))

    score = 100.0
    breakdown: dict[str, float] = {}

    # Deduction A: Prime rate above 5%
    prime_excess = max(0.0, (dprime - 5.0) / 0.25)
    deduct_prime = 5.0 * prime_excess
    score -= deduct_prime
    breakdown["prime_deduction"] = round(deduct_prime, 2)

    # Deduction B: Large firm tightening
    deduct_large = max(0.0, drtscilm * 1.0)
    score -= deduct_large
    breakdown["tightening_large_deduction"] = round(deduct_large, 2)

    # Deduction C: Small firm tightening
    deduct_small = max(0.0, drtscis * 0.5)
    score -= deduct_small
    breakdown["tightening_small_deduction"] = round(deduct_small, 2)

    # Deduction D: Inverted yield curve
    deduct_yield = 3.0 if t10y2y < 0 else 0.0
    score -= deduct_yield
    breakdown["yield_curve_deduction"] = deduct_yield

    # Deduction E: Jobless claims above 250K baseline
    deduct_icsa = max(0.0, (icsa - 250_000) / 10_000)
    score -= deduct_icsa
    breakdown["jobless_claims_deduction"] = round(deduct_icsa, 2)

    # Bonus A: Business applications trending up
    bonus_busapp = 5.0 if busapp_up else 0.0
    score += bonus_busapp
    breakdown["busapp_bonus"] = bonus_busapp

    # Bonus B: Healthy yield spread
    bonus_yield = 3.0 if t10y2y > 1.0 else 0.0
    score += bonus_yield
    breakdown["yield_spread_bonus"] = bonus_yield

    final_score = max(0, min(100, round(score)))
    label = _get_label(final_score)

    return {
        "health_score": final_score,
        "status_label": label,
        "breakdown": breakdown,
    }
