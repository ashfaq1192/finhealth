"""
FRED API data fetcher.
Fetches the 6 canonical economic indicators using verified series IDs.
"""

import os
from datetime import datetime
from typing import Any

import requests

FRED_BASE = "https://api.stlouisfed.org/fred/series/observations"

SERIES = {
    "dprime": "DPRIME",
    "drtscilm": "DRTSCILM",
    "drtscis": "DRTSCIS",
    "t10y2y": "T10Y2Y",
    "icsa": "ICSA",
    "busappwnsaus": "BUSAPPWNSAUS",
}


def _fetch_series(series_id: str, api_key: str, limit: int = 5) -> list[dict]:
    """Fetch the most recent observations for a FRED series."""
    params = {
        "series_id": series_id,
        "api_key": api_key,
        "sort_order": "desc",
        "limit": limit,
        "file_type": "json",
    }
    resp = requests.get(FRED_BASE, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json().get("observations", [])


def _latest_value(observations: list[dict]) -> float | None:
    """Return the most recent non-null, non-'.' observation value."""
    for obs in observations:
        val = obs.get("value", ".")
        if val not in (".", "", None):
            try:
                return float(val)
            except ValueError:
                continue
    return None


def fetch_all_indicators() -> dict[str, Any]:
    """
    Fetch all 6 FRED indicators and return a dict with their latest values.
    Raises RuntimeError if any indicator cannot be fetched.
    """
    api_key = os.environ["FRED_API_KEY"]
    result: dict[str, Any] = {}
    errors: list[str] = []

    for key, series_id in SERIES.items():
        try:
            obs = _fetch_series(series_id, api_key, limit=5)
            value = _latest_value(obs)
            if value is None:
                errors.append(f"{series_id}: no non-null value in last 5 observations")
            else:
                result[key] = value
                # Store all observations for trend calculation
                if key == "busappwnsaus":
                    result["_busapp_obs"] = obs
        except Exception as exc:
            errors.append(f"{series_id}: {exc}")

    if errors:
        print(f"[fred] Fetch warnings: {errors}")

    # Calculate BUSAPPWNSAUS 4-week trend
    busapp_obs = result.pop("_busapp_obs", [])
    if len(busapp_obs) >= 5:
        try:
            values = []
            for o in busapp_obs:
                v = o.get("value", ".")
                if v not in (".", "", None):
                    values.append(float(v))
                if len(values) == 5:
                    break
            if len(values) == 5:
                recent_avg = sum(values[:4]) / 4
                result["busapp_trending_up"] = recent_avg > values[4]
            else:
                result["busapp_trending_up"] = False
        except Exception:
            result["busapp_trending_up"] = False
    else:
        result["busapp_trending_up"] = False

    # Validate all required keys are present
    required = set(SERIES.keys())
    missing = required - set(result.keys())
    if missing:
        raise RuntimeError(f"Could not fetch indicators: {missing}")

    result["fetch_date"] = datetime.utcnow().date().isoformat()
    return result
