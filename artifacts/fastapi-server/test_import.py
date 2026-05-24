import sys
import traceback
try:
    from app.main import app
    print("SUCCESS: App imported without errors")
except Exception as e:
    print("ERROR:")
    traceback.print_exc()
