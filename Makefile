run-store:
	PYTHONPATH=. python -m uvicorn Store.main:app --reload --port 8000

run-warehouse:
	PYTHONPATH=. python -m uvicorn Warehouse.main:app --reload --port 8001

run-auth:
	PYTHONPATH=. python -m uvicorn auth.main:app --reload --port 8002

run-webapp:
	cd webapp && npm run dev -- --port 5173
