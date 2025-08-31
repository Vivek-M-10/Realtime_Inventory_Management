import requests
import os

STORE_URL = os.getenv("STORE_URL", "http://localhost:8000")

def fetch_admin_kpis():
    try:
        res = requests.get(f"{STORE_URL}/orders")
        if res.status_code != 200:
            return {}
        all_orders = res.json()
        total_orders = len(all_orders)
        revenue = sum(o["total"] for o in all_orders)
        completed = sum(1 for o in all_orders if o["status"] == "completed")
        pending = sum(1 for o in all_orders if o["status"] == "pending")

        return {
            "total_orders": total_orders,
            "completed_orders": completed,
            "pending_orders": pending,
            "revenue": revenue,
        }
    except Exception:
        return {}
