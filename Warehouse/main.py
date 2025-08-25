from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from redis_om import get_redis_connection, HashModel
from fastapi import Header, Depends
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from auth.roles import role_required


INTERNAL_SECRET = os.getenv("INTERNAL_SECRET")

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

# Redis connection
redis = get_redis_connection(
    host="redis-13877.c17.us-east-1-4.ec2.redns.redis-cloud.com",
    port=13877,
    decode_responses=True,
    password="8LTSrrJshiVsSYvcH5UCKpcmHGJZZqtW",
)

# Redis OM model
class Product(HashModel):
    name: str
    price: float
    quantity: int

    class Meta:
        database = redis

# Pydantic model for request validation
class ProductIn(BaseModel):
    name: str
    price: float
    quantity: int

class ProductUpdate(BaseModel):
    quantity: int
@app.post("/product")
def create_product(product: ProductIn, user=Depends(role_required("Admin"))):
    product_obj = Product(**product.dict())
    return product_obj.save()

@app.get("/product/{product_id}")
def read_product(product_id: str):
    product = Product.get(product_id)
    return product

@app.get("/products")
def read_all():
    products = Product.all_pks()
    return [format(pk) for pk in products]

def format(pk: str):
    product = Product.get(pk)
    return {
        "id": product.pk,
        "name": product.name,
        "price": product.price,
        "quantity": product.quantity,
    }

@app.delete("/products/{product_id}")
def delete_product(product_id: str, user=Depends(role_required("Admin"))):
    product = Product.get(product_id)
    Product.delete(product_id)
    return {"deleted id": product.pk}

@app.put("/internal-update/{product_id}")
def internal_update_product(product_id: str, update: ProductUpdate, x_internal_secret: str = Header(..., alias="X-Internal-Secret")):
    print("x_internal_secret", x_internal_secret,INTERNAL_SECRET)
    if x_internal_secret != INTERNAL_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        product = Product.get(product_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.quantity < update.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    product.quantity -= update.quantity
    product.save()

    return {"message": "Stock updated successfully"}
