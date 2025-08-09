import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from redis_om import get_redis_connection, HashModel
import requests
from fastapi.background import BackgroundTasks

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

class ProductOrder(HashModel):
    product_id: str
    quantity: int
    class Meta:
        database = redis

class ProductOrderIn(BaseModel):
    product_id: str
    quantity: int

class Order(HashModel):
    product_id: str
    price: float
    fee: float
    quantity: int
    status: str

    class Meta:
        database = redis

@app.post("/order")
def create_order(product_order: ProductOrderIn, background_tasks: BackgroundTasks):
    req = requests.get(f'http://localhost:8001/product/{product_order.product_id}')
    product = req.json()
    fee = product['price']*0.2

    order = Order(
        product_id= product_order.product_id,
        price=product['price'],
        quantity=product_order.quantity,
        fee = fee,
        total = product['price']* fee,
        status = "pending"
    )
    order.save()

    background_tasks.add_task(order_complete, order)

    return order

@app.get("/orders/{pk}")
def get_order(pk: str):
    return format(pk)

@app.get("/orders")
def get_order_all():
    return [format(pk) for pk in Order.all_pks()]

def format(pk: str):
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
    redis.xadd("order-completed", fields= order.dict())
    



