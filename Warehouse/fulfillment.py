import time
import logging
from main import redis, Product

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

STREAM_KEY = "order-completed"
GROUP_NAME = "warehouse-group"
CONSUMER_NAME = "fulfillment-service"

# Create group if it doesn't exist
try:
    redis.xgroup_create(name=STREAM_KEY, groupname=GROUP_NAME, mkstream=True)
    logging.info(f"Created group '{GROUP_NAME}' for stream '{STREAM_KEY}'")
except Exception as e:
    logging.warning(f"Group may already exist: {e}")

def process_order(order_data):
    """Process a single order and update product quantity."""
    try:
        product_id = order_data.get(b'product_id', b'').decode()
        quantity = int(order_data.get(b'quantity', b'0'))

        if not product_id or quantity <= 0:
            logging.error(f"Invalid order data: {order_data}")
            return

        product = Product.get(product_id)
        if product.quantity >= quantity:
            product.quantity -= quantity
            product.save()
            logging.info(f"Order processed: Product {product_id}, -{quantity} units")
        else:
            logging.warning(f"Insufficient stock for {product_id}, refunding...")
            redis.xadd(name='refund-order', fields=order_data)
    except Exception as e:
        logging.error(f"Error processing order {order_data}: {e}")

def consume_orders():
    """Continuously consume messages from the Redis stream."""
    try:
        while True:
            results = redis.xreadgroup(
                groupname=GROUP_NAME,
                consumername=CONSUMER_NAME,
                streams={STREAM_KEY: '>'},
                count=1,
                block=5000  # Wait max 5s before checking again
            )

            if results:
                for stream_name, messages in results:
                    for message_id, message_data in messages:
                        process_order(message_data)
                        # Acknowledge message after processing
                        redis.xack(STREAM_KEY, GROUP_NAME, message_id)
            else:
                logging.debug("No new messages...")
    except KeyboardInterrupt:
        logging.info("Shutting down consumer gracefully...")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")

if __name__ == "__main__":
    consume_orders()
