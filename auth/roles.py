from fastapi import Depends, HTTPException, status
from .auth import get_current_user

def role_required(required_role: str):
    def wrapper(user=Depends(get_current_user)):
        if user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied"
            )
        return user
    return wrapper
