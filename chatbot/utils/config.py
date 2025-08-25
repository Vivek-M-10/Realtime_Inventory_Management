import os
from dotenv import load_dotenv

# Load the root .env (same pattern as your other services)
load_dotenv()

STORE_API_URL = os.getenv("STORE_API_URL", "http://localhost:8000")
