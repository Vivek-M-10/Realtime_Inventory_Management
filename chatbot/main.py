import os
import sys
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Ensure we can import auth from the project root (same trick as your Warehouse service)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from auth.roles import role_required  # reuse your RBAC

from chatbot.modules.invoice import get_invoice
from chatbot.modules.kpis import compute_kpis
from chatbot.schemas import InvoiceResponse, KPIResponse
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Chatbot (Invoice & KPIs)")

# CORS like your other services
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/chat/invoice/{order_id}", response_model=InvoiceResponse)
def invoice(order_id: str, user=Depends(role_required("User"))):
    """
    Returns a JSON invoice for an order.
    NOTE: Your Store service doesn't track user ownership yet,
    so this is not scoped to a specific user.
    """
    try:
        return get_invoice(order_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/chat/kpis", response_model=KPIResponse)
def kpis(user=Depends(role_required("Admin"))):
    """
    Returns business KPIs, admin-only.
    """
    try:
        return compute_kpis()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
