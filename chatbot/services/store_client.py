import requests
import os

STORE_URL = os.getenv("STORE_URL", "http://localhost:8000")

def fetch_orders(user_id: str, last_n: int = 5):
    try:
        res = requests.get(f"{STORE_URL}/orders")
        if res.status_code != 200:
            return []
        all_orders = res.json()
        user_orders = [o for o in all_orders if o["user_id"] == user_id]
        return user_orders[-last_n:]
    except Exception:
        return []

def fetch_invoices(user_id: str):
    orders = fetch_orders(user_id, last_n=20)
    return [o for o in orders if o["status"] == "completed"]
