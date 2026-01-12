# Gunicorn configuration for Azure Web App
import os
from app import app

if __name__ == "__main__":
    # Get port from environment variable (Azure sets this)
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=port)