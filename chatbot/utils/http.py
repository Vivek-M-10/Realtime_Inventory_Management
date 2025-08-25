import requests

class HTTPError(Exception):
    pass

def get_json(url: str):
    try:
        r = requests.get(url, timeout=5)
        if r.status_code != 200:
            raise HTTPError(f"GET {url} -> {r.status_code}: {r.text}")
        return r.json()
    except requests.RequestException as e:
        raise HTTPError(str(e))
