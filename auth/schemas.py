from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    username: str
    role: str

    class Config:
        orm_mode = True

class AdminOut(BaseModel):
    username: str
    token: str
    class Config:
        orm_mode = True