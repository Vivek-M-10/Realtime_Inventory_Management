import requests

# Config
STORE_URL = "http://localhost:8000"   # Store microservice


def fetch_orders(user_id: str, last_n: int = 5):
    """Fetch last N orders for a user from Store microservice"""
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
    """Treat completed orders as invoices"""
    orders = fetch_orders(user_id, last_n=20)
    invoices = [o for o in orders if o["status"] == "completed"]
    return invoices


def fetch_admin_kpis():
    """Fetch KPIs like total orders, revenue"""
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


def generate_response(user_id: str, message: str, role: str = "User"):
    """Generate chatbot response based on message"""
    msg = message.lower()

    if "invoice" in msg:
        invoices = fetch_invoices(user_id)
        if not invoices:
            return "I couldn’t find any invoices for you."
        return f"Here are your invoices: {invoices}"

    if "order" in msg:
        n = 3
        for word in msg.split():
            if word.isdigit():
                n = int(word)
        orders = fetch_orders(user_id, last_n=n)
        if not orders:
            return f"No orders found in your last {n} records."
        return f"Here are your last {n} orders: {orders}"

    if role == "Admin" and ("kpi" in msg or "stats" in msg or "report" in msg):
        kpis = fetch_admin_kpis()
        return f"📊 Current KPIs: {kpis}"

    return "Hi! You can ask me about your invoices, last orders, or (if admin) KPIs."
