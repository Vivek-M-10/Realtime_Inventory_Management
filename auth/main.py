from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import database, models, schemas, auth, roles
from dotenv import load_dotenv
from auth.auth import oauth2_scheme
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware



models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS config
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_pw = auth.hash_password(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_pw, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@app.post("/login")
def login(credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == credentials.username).first()
    if not user or not auth.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = auth.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "role": user.role,"username":user.username}

@app.get("/admin-only")
def admin_only(user=Depends(roles.role_required("Admin"))):
    return {"message": f"Hello Admin {user.username}"}

@app.get("/user-only")
def user_only(user=Depends(roles.role_required("User"))):
    return {"message": f"Hello User {user.username}"}
