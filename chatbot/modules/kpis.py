from typing import List, Dict
from chatbot.utils.config import STORE_API_URL
from chatbot.utils.http import get_json, HTTPError
from chatbot.schemas import KPIResponse

def compute_kpis() -> KPIResponse:
    """
    Aggregates KPIs from the Store service.
    Relies on store/main.py endpoint: GET /orders
    """
    orders: List[Dict] = get_json(f"{STORE_API_URL}/orders")

    total_orders = len(orders)
    completed = [o for o in orders if o.get("status") == "completed"]
    pending = [o for o in orders if o.get("status") == "pending"]
    revenue = float(sum(float(o.get("total", 0.0)) for o in completed))
    avg_order_value = float(revenue / len(completed)) if completed else None

    return KPIResponse(
        total_orders=total_orders,
        completed_orders=len(completed),
        pending_orders=len(pending),
        revenue=revenue,
        avg_order_value=avg_order_value,
    )
