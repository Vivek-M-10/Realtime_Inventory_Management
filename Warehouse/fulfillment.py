import requests
import time
import os
from redis_om import get_redis_connection
from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = "redis-10991.c325.us-east-1-4.ec2.redns.redis-cloud.com"
REDIS_PORT = 10991
WAREHOUSE_API = "http://localhost:8001"  # Warehouse service URL
INTERNAL_SECRET = os.getenv("INTERNAL_SECRET")

redis = get_redis_connection(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,
    password="uEDy96wlarq3bInRYlyadQ7CQtYSGntL"
)

def update_product_stock(product_id: str, quantity: int):
    try:
        response = requests.put(
            f"{WAREHOUSE_API}/internal-update/{product_id}",
            headers={"X-Internal-Secret": INTERNAL_SECRET},
            json={"quantity": quantity}
        )
        if response.status_code == 200:
            print(f"[Fulfillment] Successfully updated product {product_id} stock by {quantity}")
        else:
            print(f"[Fulfillment] Failed to update product {product_id}: {response.text}")
    except Exception as e:
        print(f"[Fulfillment] Exception during update for product {product_id}: {e}")

def process_order(order_data):
    product_id = order_data.get("product_id")
    quantity_str = order_data.get("quantity", "0")
    try:
        quantity = int(quantity_str)
    except ValueError:
        print(f"[Fulfillment] Invalid quantity value: {quantity_str}, skipping order")
        return

    print(f"[Fulfillment] Processing order for product {product_id}, qty {quantity}")
    update_product_stock(product_id, quantity)

if __name__ == "__main__":
    print("Fulfillment service started. Listening for order-completed events...")

    last_id = "0-0"
    while True:
        try:
            entries = redis.xread({"order-completed": last_id}, block=5000, count=1)
            if entries:
                stream, messages = entries[0]
                for message_id, message_data in messages:
                    last_id = message_id
                    process_order(message_data)
        except Exception as e:
            print(f"[Fulfillment] Error processing orders: {e}")
        time.sleep(1)
