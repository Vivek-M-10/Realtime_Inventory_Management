import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from redis_om import get_redis_connection, HashModel
from auth.utils import require_role  # Import role-based auth

app = FastAPI()

# CORS config
origins = ["*"]  # Update with actual frontend origin if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis = get_redis_connection(
    host="redis-10991.c325.us-east-1-4.ec2.redns.redis-cloud.com",
    port=10991,
    decode_responses=True,
    password="uEDy96wlarq3bInRYlyadQ7CQtYSGntL",
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

@app.post("/product")
def create_product(product: ProductIn, admin=Depends(require_role("admin"))):
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
def delete_product(product_id: str, admin=Depends(require_role("admin"))):
    product = Product.get(product_id)
    Product.delete(product_id)
    return {"deleted id": product.pk}
