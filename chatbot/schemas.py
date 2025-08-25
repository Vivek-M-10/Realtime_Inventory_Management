from pydantic import BaseModel
from typing import Optional

class InvoiceResponse(BaseModel):
    order_id: str
    product_id: str
    quantity: int
    fee: float
    total: float
    status: str

class KPIResponse(BaseModel):
    total_orders: int
    completed_orders: int
    pending_orders: int
    revenue: float
    avg_order_value: Optional[float] = None
