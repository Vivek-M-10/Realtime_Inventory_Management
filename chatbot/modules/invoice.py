from typing import Dict
from chatbot.utils.config import STORE_API_URL
from chatbot.utils.http import get_json, HTTPError
from chatbot.schemas import InvoiceResponse

def get_invoice(order_id: str) -> InvoiceResponse:
    """
    Fetches a single order from the Store service and returns an invoice payload.
    Relies on store/main.py endpoint: GET /orders/{pk}
    """
    data: Dict = get_json(f"{STORE_API_URL}/orders/{order_id}")
    # store/main.py returns keys: order_id, product_id, quantity, fee, total, status
    try:
        return InvoiceResponse(
            order_id=str(data["order_id"]),
            product_id=str(data["product_id"]),
            quantity=int(data["quantity"]),
            fee=float(data["fee"]),
            total=float(data["total"]),
            status=str(data["status"]),
        )
    except KeyError as e:
        raise HTTPError(f"Missing key in Store response: {e}")
