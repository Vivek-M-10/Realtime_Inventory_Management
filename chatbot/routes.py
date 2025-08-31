from fastapi import APIRouter, Depends
from .schemas import ChatRequest, ChatResponse
from .chatbot import generate_response
from auth.roles import role_required

router = APIRouter(prefix="/chatbot")


@router.post("/", response_model=ChatResponse)
def chat_with_bot(req: ChatRequest, user=Depends(role_required("User"))):
    """
    Conversational chatbot endpoint.
    Users can see invoices/last orders, admins can see KPIs.
    """
    response = generate_response(
        user_id=str(user.id),
        message=req.message,
        role=user.role
    )
    return ChatResponse(reply=response)
