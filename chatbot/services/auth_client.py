import requests
import os
from fastapi import Depends, HTTPException, Header

AUTH_URL = os.getenv("AUTH_URL", "http://localhost:8002")

def get_current_user(authorization: str = Header(None)):
    """
    Validate token with Auth microservice.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    try:
        res = requests.get(f"{AUTH_URL}/verify", headers={"Authorization": authorization})
        if res.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid token")
        return res.json()
    except Exception:
        raise HTTPException(status_code=401, detail="Auth service error")
