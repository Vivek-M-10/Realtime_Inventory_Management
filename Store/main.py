import time
import requests
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from redis_om import get_redis_connection, HashModel
from fastapi.background import BackgroundTasks
from auth.roles import role_required



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
    host="redis-10991.c325.us-east-1-4.ec2.redns.redis-cloud.com",
    port=10991,
    decode_responses=True,
    password="uEDy96wlarq3bInRYlyadQ7CQtYSGntL",
)

class ProductOrderIn(BaseModel):
    product_id: str
    quantity: int

class Order(HashModel):
    product_id: str
    price: float
    fee: float
    quantity: int
    total: float
    status: str

    class Meta:
        database = redis

@app.post("/order")
def create_order(
    product_order: ProductOrderIn,
    background_tasks: BackgroundTasks,
    user=Depends(role_required("User"))# ✅ Restrict to "user" role
):
    # Fetch product details
    req = requests.get(f'http://localhost:8001/product/{product_order.product_id}')
    if req.status_code != 200:
        raise HTTPException(status_code=404, detail="Product not found")
    product = req.json()

    # Calculate fee and total
    fee = 100
    total = product['price'] * product_order.quantity + fee

    # Create order
    order = Order(
        product_id=product_order.product_id,
        price=product['price'],
        quantity=product_order.quantity,
        fee=fee,
        total=total,
        status="pending"
    )
    order.save()

    background_tasks.add_task(order_complete, order)
    return order

@app.get("/orders/{pk}")
def get_order(pk: str):
    return format_order(pk)

@app.get("/orders")
def get_order_all():
    return [format_order(pk) for pk in Order.all_pks()]

def format_order(pk: str):
    order = Order.get(pk)
    return {
        "order_id": order.pk,
        "product_id": order.product_id,
        "quantity": order.quantity,
        "fee": order.fee,
        "total": order.total,
        "status": order.status,
    }

def order_complete(order: Order):
    time.sleep(5)
    order.status = "completed"
    order.save()
    redis.xadd("order-completed", fields=order.dict())

@app.delete("/all_orders/")
def clear_orders():
    # Delete all orders from Redis OM
    for order_pk in Order.all_pks():
        Order.delete(order_pk)

    # Delete streams
    redis.delete("order-completed")
    redis.delete("refund-order")

    return {"status": "success", "message": "All orders and streams cleared"}
